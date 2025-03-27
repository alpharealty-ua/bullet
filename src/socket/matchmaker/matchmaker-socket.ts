import { Socket } from 'socket.io-client'

import {
  ConfirmMatch,
  ConnectionStatus,
  MatchCreatedResponse,
  Indicator,
  InfoResponse,
  JoinedMatchmakingResponse,
  JoinMatchmaking,
  LeftMatchmakingResponse,
  MatchCancelResponse,
  MatchConfirmationUpdate,
  MatchDetails,
  MatchFoundResponse,
  MatchmakingStatus,
  PingData,
  AdditionalPlayerMetadata,
  StatisticsResponse,
} from '@/socket/matchmaker/matchmaker-soket.types'
import { MatchmakerPingClient } from '@/socket/matchmaker/matchmaker-ping-client'
import { PlaySound } from '@/store/settings.store'
import { Info, Statistics } from '@/socket/matchmaker/matchmaker-soket.types'
import { addLogEntry, showCustomAlert, debug } from '../utils'

// TODO: TRANSFORM TO CLASS
// TODO: REMOVED DISPATCH TYPE
export const matchmakerSocket = (
  socket: Socket,
  {
    token,
    playAudio,
    setAuthenticated,
    setMatchmakingStatus,
    setConnectionStatus,
    setPingData,
    setStatistics,
    setMatchDetails,
    setIndicators,
    setConfirmationTimeoutSeconds,
    setInfo,
    setGameId,
  }: {
    token: string
    playAudio: PlaySound
    setAuthenticated: (value: boolean) => void
    setMatchmakingStatus: (value: MatchmakingStatus) => void
    setConnectionStatus: (value: ConnectionStatus) => void
    setPingData: React.Dispatch<React.SetStateAction<PingData>>
    setStatistics: React.Dispatch<React.SetStateAction<Statistics>>
    setMatchDetails: (value: MatchDetails | null) => void
    setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>>
    setConfirmationTimeoutSeconds: (value: number) => void
    setInfo: React.Dispatch<React.SetStateAction<Info>>
    setGameId: (gameId: string) => void
  },
) => {
  let off: () => void = () => void 1

  let currentPing = 0
  let playerId: string | null = null
  let currentMatchId: string | null = null
  let matchConfirmationActive = false
  let matchmakingStatus: MatchmakingStatus = 'not-in-queue'
  let authenticated = false

  const updateAuthenticated = (auth: boolean) => {
    setAuthenticated(auth)
    authenticated = auth
  }

  const updateMatchmakingStatus = (status: MatchmakingStatus) => {
    setMatchmakingStatus(status)
    matchmakingStatus = status
  }

  const toggleConnection = () => {
    socket.connected ? disconnect() : connect()
  }

  const connect = () => {
    socket.auth = { token }
    socket.connect()

    const matchmakerPingClient = new MatchmakerPingClient(socket, {
      onPingUpdate: (pingData: PingData) => {
        currentPing = pingData.ping
        setPingData(pingData)
      },
    })

    // @ts-ignore
    const handleOnAny = (eventName: string, ...args: any[]) => {
      // user.debugLog('incoming', eventName, args);
      // console.log(`Event received: ${eventName}`, args)
    }

    const handleConnect = () => {
      addLogEntry('Connected to matchmaker service', 'success')
      setConnectionStatus('authenticating')
    }

    const handleDisconnect = () => {
      off()

      addLogEntry('Disconnected from matchmaker service', 'warning')
      setConnectionStatus('disconnected')
      updateAuthenticated(false)

      // Reset the match confirmation flag
      matchConfirmationActive = false

      // Hide match details
      setMatchDetails(null)
    }

    const connect_error = (error: { message: string }) => {
      addLogEntry(`Connection error: ${error.message}`, 'error')
      showCustomAlert(`Connection error: ${error.message}`, 'error')
      setConnectionStatus('disconnected')
    }

    const handleInfo = (data: InfoResponse) => {
      addLogEntry(`Received service info: ${JSON.stringify(data)}`, 'info')

      if (data.authenticated) {
        updateAuthenticated(true)
        setConnectionStatus('authenticated')

        // Update stats
        setStatistics((p) => ({
          ...p,
          playersInQueue: data.playersInQueue || 0,
        }))

        // Update ping if available
        if (data.currentPing) {
          setPingData((p) => ({
            ...p,
            ping: data.currentPing ?? p.ping,
            jitter: data.currentJitter ?? p.jitter,
            measurements: data.measurementsCount || p.measurements,
          }))
        }
      } else {
        updateAuthenticated(false)
        setConnectionStatus('not-authenticated')
      }
    }

    const handleError = (error: { message: string }) => {
      addLogEntry(`Error: ${error.message}`, 'error')
      showCustomAlert(`Error: ${error.message}`, 'error')

      if (error.message === 'Authentication failed') {
        setConnectionStatus('authentication-failed')
        updateAuthenticated(false)
      } else if (
        error.message ===
        'Cannot leave matchmaking while a match confirmation is pending'
      ) {
        // Re-enable the leave button if the server rejected the leave request
      }
    }

    const handleJoinedMatchmaking = (data: JoinedMatchmakingResponse) => {
      addLogEntry(`Joined matchmaking: ${JSON.stringify(data)}`, 'success')
      setInfo((p) => ({ ...p, playerId: data.playerId }))
      playerId = data.playerId

      // Update UI

      // Update matchmaking status
      if (matchmakingStatus === 'not-in-queue') {
        updateMatchmakingStatus('searching')
      }

      // Store your player info for display
      setInfo((p) => ({ ...p, ping: data.ping }))

      // Only hide the confirmation dialog if no match confirmation is active
      if (matchmakingStatus === 'not-in-queue') {
        // Hide any previous match details
        setMatchDetails(null)
      }

      // Log if this is a re-join after match cancellation
      if (
        data.message &&
        data.message.includes('Returned to matchmaking after')
      ) {
        debug(`Auto-rejoined matchmaking: ${data.message}`)
        showCustomAlert(data.message, 'info')
      }
    }

    const handleLeftMatchmaking = (data: LeftMatchmakingResponse) => {
      addLogEntry(`Left matchmaking: ${JSON.stringify(data)}`, 'info')

      // Show notification
      showCustomAlert('You have left the matchmaking queue', 'info')

      // Update matchmaking status
      updateMatchmakingStatus('not-in-queue')

      // Update UI

      // Hide match details
      setMatchDetails(null)
    }

    const handleMatchFound = (matchData: MatchFoundResponse) => {
      addLogEntry(`Match found: ${JSON.stringify(matchData)}`, 'success')

      // Set the flag to indicate a match confirmation is active
      matchConfirmationActive = true

      // Update matchmaking status
      updateMatchmakingStatus('match-found')

      // Show match confirmation dialog
      debug(`Showing match confirmation for match ${matchData.matchId}`)

      currentMatchId = matchData.matchId

      // Create player confirmation indicators
      setIndicators(
        matchData.players.map((playerId) => ({ playerId, confirm: false })),
      )

      // Play match found sound
      playAudio('matchFoundSound')

      // Show a notification
      showCustomAlert(
        'Match found! Please confirm to join the game.',
        'success',
      )

      // TODO: SET ALL RESPONSE DATA
      if (matchData.confirmationRequired) {
        const confirmationTimeoutSeconds =
          matchData.confirmationTimeoutSeconds || 10

        setConfirmationTimeoutSeconds(confirmationTimeoutSeconds)
      }
    }

    const handleMatchConfirmationUpdate = (data: MatchConfirmationUpdate) => {
      addLogEntry(`Match confirmation update: ${JSON.stringify(data)}`, 'info')

      if (data.matchId !== currentMatchId) {
        return
      }

      // Update player confirmation indicators
      setIndicators((prevIndicators) =>
        prevIndicators.map((indicator) => ({
          ...indicator,
          confirm: data.confirmedPlayers.includes(indicator.playerId),
        })),
      )
    }

    const handleMatchCanceled = (data: MatchCancelResponse) => {
      addLogEntry(`Match canceled: ${JSON.stringify(data)}`, 'warning')

      // Reset the match confirmation flag
      matchConfirmationActive = false

      // Update matchmaking status based on whether the player was returned to queue
      const status =
        data.reason === 'player_declined' && data.declinedBy !== playerId
          ? 'searching'
          : 'not-in-queue'
      updateMatchmakingStatus(status)

      // Play match canceled sound
      playAudio('matchCanceledSound')

      // Show reason in a more user-friendly way
      let reason = 'Unknown reason'
      if (data.reason === 'confirmation_timeout') {
        reason = 'Not all players confirmed in time'
      } else if (data.reason === 'player_declined') {
        reason = 'A player declined the match'
      }

      showCustomAlert(`Match canceled: ${reason}`, 'warning')
    }

    const handleMatchCreated = (data: MatchCreatedResponse) => {
      addLogEntry(`Match created: ${JSON.stringify(data)}`, 'success')

      // Reset the match confirmation flag
      matchConfirmationActive = false

      // Update matchmaking status
      updateMatchmakingStatus('match-created')

      playAudio('matchConfirmedSound')

      // Show a notification
      showCustomAlert(
        'Match created successfully! Game is being prepared.',
        'success',
      )

      // Find opponent's player ID
      const opponentPlayerId = data.players.find((id) => id !== playerId)

      const matchDetails: MatchDetails = {
        matchId: data.matchId,
        pingDifference: data.metadata?.pingDifference ?? '',
        averagePing: data.metadata?.averagePing ?? '',
        gameId: data.metadata?.gameId ?? '',
        opponent: {
          ping: 0,
          username: '',
          region: '',
          characterName: 'fatty',
        },
      }

      // Set opponent details if available
      if (opponentPlayerId && data.metadata?.playerMetadata) {
        const opponentData = data.metadata.playerMetadata[opponentPlayerId]
        if (opponentData) {
          // TODO: FIX ANY
          matchDetails.opponent.ping = opponentData.ping ?? '--'
          matchDetails.opponent.username = opponentData.username ?? ''
          matchDetails.opponent.region = opponentData.region ?? ''
          matchDetails.opponent.characterName = opponentData.characterName ?? ''
        }
      }

      setMatchDetails(matchDetails)

      currentMatchId = null
    }

    const handleDuelGameCreated = (data: MatchCreatedResponse) => {
      addLogEntry(`Duel game created: ${JSON.stringify(data)}`, 'success')

      setGameId(data.gameId)
    }

    const handleStats = (data: StatisticsResponse) => {
      addLogEntry(`Received stats: ${JSON.stringify(data)}`, 'info')

      setStatistics({
        playersInQueue: data.playersInQueue || 0,
        totalMatches: data.totalMatches || 0,
        averageWaitTime: Math.round(data.averageWaitTime || 0),
      })
    }

    off()
    // socketMatchmaker.onAny(onAny)
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', connect_error)
    socket.on('info', handleInfo)
    socket.on('error', handleError)
    socket.on('joinedMatchmaking', handleJoinedMatchmaking)
    socket.on('leftMatchmaking', handleLeftMatchmaking)
    socket.on('matchFound', handleMatchFound)
    socket.on('matchConfirmationUpdate', handleMatchConfirmationUpdate)
    socket.on('matchCanceled', handleMatchCanceled)
    socket.on('stats', handleStats)
    socket.on('matchCreated', handleMatchCreated)
    socket.on('duelGameCreated', handleDuelGameCreated)

    return (off = () => {
      matchmakerPingClient.dettachEventListeners()
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('connect_error', connect_error)
      socket.off('info', handleInfo)
      socket.off('error', handleError)
      socket.off('joinedMatchmaking', handleJoinedMatchmaking)
      socket.off('leftMatchmaking', handleLeftMatchmaking)
      socket.off('matchFound', handleMatchFound)
      socket.off('matchConfirmationUpdate', handleMatchConfirmationUpdate)
      socket.off('matchCanceled', handleMatchCanceled)
      socket.off('stats', handleStats)
      socket.off('matchCreated', handleMatchCreated)
      socket.off('duelGameCreated', handleDuelGameCreated)
    })
  }

  const disconnect = () => {
    socket.disconnect()

    setConnectionStatus('disconnected')
    updateMatchmakingStatus('not-in-queue')

    setMatchDetails(null)
    setPingData({
      ping: 0,
      jitter: 0,
      measurements: 0,
      history: [],
      sequence: 0,
    })
  }

  const joinMatchmaking = (metadata: AdditionalPlayerMetadata) => {
    if (!socket || !socket.connected || !authenticated) {
      addLogEntry('Not connected or authenticated', 'error')
      showCustomAlert('Not connected or authenticated', 'error')
      return
    }

    // Check if ping is too high
    if (currentPing > 500) {
      addLogEntry(
        `Cannot join matchmaking: ping too high (${currentPing}ms)`,
        'error',
      )
      showCustomAlert(
        `Cannot join matchmaking: ping too high (${currentPing}ms)`,
        'error',
      )
      return
    }

    // Reset any active match confirmation
    matchConfirmationActive = false

    const joinMatchmaking: JoinMatchmaking = {
      betOptions: {
        networkId: 'local',
        coinId: 'usd',
        betAmount: '0.01',
        maxRounds: 10,
      },
      metadata,
      matchConfirmationRequired: true,
    }

    socket.emit('joinMatchmakingWithBet', joinMatchmaking)

    addLogEntry(
      `Joining matchmaking as ${metadata.username} with server-measured ping ${currentPing}ms`,
      'info',
    )
  }

  const leaveMatchmaking = () => {
    if (!socket || !socket.connected) {
      addLogEntry('Not connected', 'error')
      showCustomAlert('Not connected', 'error')
      return
    }

    // Check if a match confirmation is active
    if (matchConfirmationActive) {
      addLogEntry(
        'Cannot leave matchmaking while a match confirmation is active',
        'warning',
      )
      showCustomAlert(
        'Cannot leave matchmaking while a match confirmation is active. Please accept or decline the match first.',
        'warning',
      )
      return
    }

    socket.emit('leaveMatchmaking')
    addLogEntry('Leaving matchmaking', 'info')
  }

  const confirmMatch = () => {
    if (!socket || !socket.connected || !authenticated || !currentMatchId) {
      addLogEntry(
        'Cannot confirm match: not connected or authenticated',
        'error',
      )
      showCustomAlert(
        'Cannot confirm match: not connected or authenticated',
        'error',
      )
      return
    }

    debug(`Confirming match ${currentMatchId}`)
    socket.emit('confirmMatch', {
      matchId: currentMatchId,
    } satisfies ConfirmMatch)
    addLogEntry(`Confirming match ${currentMatchId}`, 'info')
  }

  const declineMatch = () => {
    if (!socket || !socket.connected || !authenticated || !currentMatchId) {
      addLogEntry(
        'Cannot decline match: not connected or authenticated',
        'error',
      )
      showCustomAlert(
        'Cannot decline match: not connected or authenticated',
        'error',
      )
      return
    }

    socket.emit('declineMatch', { matchId: currentMatchId })
    addLogEntry(`Declining match ${currentMatchId}`, 'info')

    // Reset the match confirmation flag
    matchConfirmationActive = true
  }

  const getStats = () => {
    if (!socket || !socket.connected || !authenticated) {
      addLogEntry('Not connected or authenticated', 'error')
      return
    }

    socket.emit('getStats')
    addLogEntry('Requesting matchmaking stats', 'info')
  }

  return {
    connect,
    disconnect,
    toggleConnection,
    joinMatchmaking,
    leaveMatchmaking,
    confirmMatch,
    declineMatch,
    getStats,
  }
}
