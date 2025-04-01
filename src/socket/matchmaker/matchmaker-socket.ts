import { Socket } from 'socket.io-client'

import {
  ConnectionStatus,
  MatchCreatedResponse,
  Indicator,
  InfoResponse,
  JoinedMatchmakingResponse,
  LeftMatchmakingResponse,
  MatchCancelResponse,
  MatchConfirmationUpdate,
  MatchDetails,
  MatchFoundResponse,
  MatchmakingStatus,
  PingData,
  StatisticsResponse,
  DuelGameCreatedResponse,
} from '@/socket/matchmaker/matchmaker-soket.types'
import { MatchmakerPingClient } from '@/socket/matchmaker/matchmaker-ping-client'
import { PlaySound } from '@/store/settings.store'
import { Statistics } from '@/socket/matchmaker/matchmaker-soket.types'
import { addLogEntry, notify } from '@/socket/utils'
import { useGameStore } from '@/store/game.store'

// TODO: TRANSFORM TO CLASS
// TODO: REMOVED DISPATCH TYPE
export const matchmakerSocket = (
  socket: Socket,
  {
    playAudio,
    setAuthenticated,
    setMatchmakingStatus,
    setConnectionStatus,
    setPingData,
    setStatistics,
    setMatchDetails,
    setIndicators,
    setConfirmationTimeoutSeconds,
    setMatchId,
    setGameId,
  }: {
    // TODO: REFACTOR
    playAudio: PlaySound
    setAuthenticated: (value: boolean) => void
    setMatchmakingStatus: (value: MatchmakingStatus) => void
    setConnectionStatus: (value: ConnectionStatus) => void
    setPingData: React.Dispatch<React.SetStateAction<PingData>>
    setStatistics: React.Dispatch<React.SetStateAction<Statistics>>
    setMatchDetails: (value: MatchDetails | null) => void
    setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>>
    setConfirmationTimeoutSeconds: (value: number) => void
    setMatchId: (value: string | null) => void
    setGameId: (value: string | null) => void
  },
) => {
  let off: () => void = () => void 1

  const on = ({
    playerId,
    currentMatchId,
    matchmakingStatus,
  }: {
    playerId: string | null
    currentMatchId: string | null
    matchmakingStatus: MatchmakingStatus
  }) => {
    const updateGameId = (gameId: string | null) => {
      setGameId(gameId)
    }

    const updatePlayerId = (newPlayerId: string | null) => {
      useGameStore.setState({ playerId: newPlayerId })
      playerId = newPlayerId
    }

    const updateAuthenticated = (auth: boolean) => {
      setAuthenticated(auth)
    }

    const updateMatchmakingStatus = (status: MatchmakingStatus) => {
      setMatchmakingStatus(status)
      matchmakingStatus = status
    }

    const updateMatchId = (matchId: string | null) => {
      setMatchId(matchId)
      currentMatchId = matchId
    }

    const matchmakerPingClient = new MatchmakerPingClient(socket, {
      onPingUpdate: (pingData: PingData) => {
        setPingData(pingData)
      },
    })

    // @ts-ignore
    const handleOnAny = (eventName: string, ...args: any[]) => {
      // user.debugLog('incoming', eventName, args);
      // console.log(`Event received: ${eventName}`, args)
    }

    const handleConnect = () => {
      setConnectionStatus('authenticating')
      updateGameId(null)
    }

    // TODO: NOT CALL IF UNMOUNT
    const handleDisconnect = () => {
      off()

      setConnectionStatus('disconnected')
      updateMatchmakingStatus('not-in-queue')

      setPingData({
        ping: 0,
        jitter: 0,
        measurements: 0,
        history: [],
        sequence: 0,
      })
      updateAuthenticated(false)
      updateGameId(null)
    }

    const connect_error = (error: { message: string }) => {
      addLogEntry(`Connection error: ${error.message}`, 'error')
      notify(`Connection error: ${error.message}`, 'error')
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
      notify(`Error: ${error.message}`, 'error')

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

      notify('You have Joined the matchmaking queue', 'success')

      // Update matchmaking status
      if (matchmakingStatus === 'not-in-queue') {
        updateMatchmakingStatus('searching')
        setMatchDetails(null)
      }

      updatePlayerId(data.playerId)

      // Log if this is a re-join after match cancellation
      if (
        data.message &&
        data.message.includes('Returned to matchmaking after')
      ) {
        notify(data.message, 'info')
      }
    }

    const handleLeftMatchmaking = (data: LeftMatchmakingResponse) => {
      addLogEntry(`Left matchmaking: ${JSON.stringify(data)}`, 'info')

      notify('You have left the matchmaking queue', 'info')

      updateMatchmakingStatus('not-in-queue')

      updatePlayerId(null)
    }

    const handleMatchFound = (matchData: MatchFoundResponse) => {
      addLogEntry(`Match found: ${JSON.stringify(matchData)}`, 'success')

      // Show a notification
      notify('Match found! Please confirm to join the game.', 'success')

      // Update matchmaking status
      updateMatchmakingStatus('match-found')

      updateMatchId(matchData.matchId)

      // Create player confirmation indicators
      setIndicators(
        matchData.players.map((playerId) => ({ playerId, confirm: false })),
      )

      // Play match found sound
      playAudio('matchFoundSound')

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

      notify(`Match canceled: ${reason}`, 'warning')
    }

    const handleMatchCreated = (data: MatchCreatedResponse) => {
      addLogEntry(`Match created: ${JSON.stringify(data)}`, 'success')

      // Update matchmaking status
      updateMatchmakingStatus('match-created')

      playAudio('matchConfirmedSound')

      // Show a notification
      notify('Match created successfully! Game is being prepared.', 'success')

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
      updateMatchId(null)
    }

    const handleDuelGameCreated = (data: DuelGameCreatedResponse) => {
      addLogEntry(`Duel game created: ${JSON.stringify(data)}`, 'success')

      updateGameId(data.gameId)
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

  return on
}
