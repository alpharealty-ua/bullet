import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { socketMatchmaker as socket } from '@/socket/socket'
import { MatchmakerPingClient } from '@/socket/matchmaker/matchmaker-ping-client'
import { useInterval } from '@/hooks/use-interval'
import { useSettingsStore } from '@/store/settings.store'

type PingData = {
  ping: number
  jitter: number
  measurements: number
  history: { ping: number; jitter: number; timestamp: number }[]
  sequence: number
}

type JoinMatchmaking = {
  betOptions?: BetOptions
  metadata?: Record<string, any> // Optional: Additional metadata
  matchConfirmationRequired: boolean
}
type ConfirmMatch = {
  matchId: string // ID of the match to confirm
  // Optional: Bet options for the match
  betOptions?: BetOptions
}

type BetOptions = {
  networkId: string // Blockchain network ID
  coinId: string // Cryptocurrency ID
  betAmount: string // Bet amount
  maxRounds?: number // Maximum number of rounds
}

type PlayerMetadata = {
  betOptions: BetOptions
  matchConfirmationRequired: boolean
  region: string
  roles: string[]
  userId: string
  username: string
}

type MatchFoundResponse = {
  matchId: string // ID of the match
  players: string[] // Array of player IDs
  // Match metadata, including bet options if available
  metadata: {
    averagePing: number
    pingDifference: number
    userIds: string[]
    playerMetadata: Record<string, PlayerMetadata>
    betOptions: BetOptions
  }
  confirmationRequired: boolean // Whether confirmation is required
  confirmationTimeoutSeconds: number // Timeout for confirmation in seconds
}

type MatchConfirmationUpdate = {
  matchId: string // ID of the match
  confirmedPlayers: string[] // Array of player IDs who have confirmed
  totalPlayers: number // Total number of players in the match
  betOptions?: BetOptions
}

type MatchCancelResponse = {
  unconfirmedPlayers: string[]
  matchId: string
} & (
  | {
      reason: 'confirmation_timeout'
    }
  | {
      reason: 'player_declined'
      declinedBy: string
    }
)

export type MatchmakingStatus =
  | 'not-in-queue'
  | 'connecting'
  | 'searching'
  | 'match-found'
  | 'match-created'

export type ConnectionStatus =
  | 'connected'
  | 'authenticating'
  | 'authenticated'
  | 'disconnected'
  | 'not-authenticated'
  | 'authentication-failed'

type JoinedMatchmakingResponse = {
  betOptions: BetOptions
  matchConfirmationRequired: boolean
  ping: number
  playerId: string
  queuedAt: string
  status: MatchmakingStatus
  message?: string
}

type LeftMatchmakingResponse = {
  playerId: string
  status: MatchmakingStatus
}

type InfoResponse = {
  authenticated: boolean
  description: string
  playersInQueue: 0
  service: string
  status: 'online'
  user: { id: string; roles: string[] }
  version: '1.0.0'
  currentPing?: number
  currentJitter?: number
  measurementsCount?: number
}

// type PingResponse = {
//   sequence: number
// }

// type PingUpdateResponse = {
//   ping: number
// }

type DuelGameCreatedResponse = {
  matchId: string // ID of the match
  gameId: string // ID of the created duel game
  // Array of players in the duel game
  players: string[]
  // Bet information
  bet: Omit<BetOptions, 'maxRounds'>
  metadata?: any
}

export type Indicator = { playerId: string; confirm: boolean }

// @ts-ignore
type Player = {
  id: string // Player ID
  username: string // Player username
}

type MatchDetails = {
  matchId: any
  pingDifference: any
  averagePing: any
  gameId: any
  opponent: { ping: number; username: string; region: string }
}

// TODO: FIX
// @ts-ignore
const addLogEntry = (message: string, type: string) => {
  // console.log(message, type)
}

const debug = (_: string) => {}

const showCustomAlert = (
  message: string,
  type: 'info' | 'success' | 'error' | 'warning',
) => {
  toast[type](message)
}

const useMatchmakingSocket = (token: string) => {
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const [pingData, setPingData] = useState<PingData>({
    ping: 0,
    jitter: 0,
    measurements: 0,
    history: [],
    sequence: 0,
  })
  const [statistics, setStatistics] = useState({
    playersInQueue: 0,
    totalMatches: 0,
    averageWaitTime: 0,
  })
  const [confirmationTimer, setConfirmationTimer] = useState({
    time: 0,
    urgent: false,
  })
  const [matchmakingStatus, setMatchmakingStatus] =
    useState<MatchmakingStatus>('not-in-queue')
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected')
  const [authenticated, setAuthenticated] = useState(false)
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [matchDetails, setMatchDetails] = useState<null | MatchDetails>(null)
  const [info, setInfo] = useState<{
    playerId: string | null
    ping: number
  }>({
    playerId: null,
    ping: 0,
  })
  const firstRender = useRef(true)
  // TODO: FIX ANY
  const resultRef = useRef<any>(null)

  const {
    connect,
    disconnect,
    toggleConnection,
    joinMatchmaking,
    leaveMatchmaking,
    confirmMatch,
    declineMatch,
    getStats,
  } = useMemo(() => {
    if (resultRef.current) {
      return resultRef.current
    }

    let off: (() => void) | null = null

    let currentPing = 0
    let playerId: string | null = null
    let currentMatchId: string | null = null
    let confirmationTimeout: number | null = null
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
      off && off()

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

        // Make sure any previous confirmation is properly cleaned up
        if (confirmationTimeout) {
          clearInterval(confirmationTimeout)
          confirmationTimeout = null
        }

        currentMatchId = matchData.matchId

        // Create player confirmation indicators
        setIndicators(
          matchData.players.map((playerId) => ({ playerId, confirm: false })),
        )

        // Play match found sound
        playAudio('matchFoundSound')

        // Start the countdown
        let timeLeft = matchData.confirmationTimeoutSeconds || 10

        setConfirmationTimer({ time: timeLeft, urgent: false })

        confirmationTimeout = window.setInterval(() => {
          timeLeft--

          // Add urgent styling when time is running low
          const urgent = timeLeft <= 3

          setConfirmationTimer({ time: timeLeft, urgent })

          if (timeLeft <= 0 && confirmationTimeout) {
            clearInterval(confirmationTimeout)
            confirmationTimeout = null
            // The server will handle the timeout
          }
        }, 1000)

        // Log that the modal is being shown
        addLogEntry(
          `Showing match confirmation modal for match ${matchData.matchId}`,
          'success',
        )

        // Show a notification
        showCustomAlert(
          'Match found! Please confirm to join the game.',
          'success',
        )
      }

      const handleMatchConfirmationUpdate = (data: MatchConfirmationUpdate) => {
        addLogEntry(
          `Match confirmation update: ${JSON.stringify(data)}`,
          'info',
        )

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

      const handleDuelGameCreated = (data: DuelGameCreatedResponse) => {
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
          },
        }

        // Set opponent details if available
        if (opponentPlayerId && data.metadata?.playerMetadata) {
          const opponentData = data.metadata.playerMetadata[opponentPlayerId]
          if (opponentData) {
            matchDetails.opponent.ping = opponentData.ping ?? '--'
            matchDetails.opponent.username = opponentData.username ?? ''
            matchDetails.opponent.region = opponentData.region ?? ''
          }
        }

        setMatchDetails(matchDetails)

        currentMatchId = null
      }

      const handleStats = (data: any) => {
        addLogEntry(`Received stats: ${JSON.stringify(data)}`, 'info')

        setStatistics({
          playersInQueue: data.playersInQueue || 0,
          totalMatches: data.totalMatches || 0,
          averageWaitTime: Math.round(data.averageWaitTime || 0),
        })
      }

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
      socket.on('matchCreated', handleDuelGameCreated)
      socket.on('duelGameCreated', handleDuelGameCreated)

      return (off = () => {
        if (!socket) {
          return
        }

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
        socket.off('matchCreated', handleDuelGameCreated)
        socket.off('duelGameCreated', handleDuelGameCreated)
      })
    }

    const disconnect = () => {
      if (!socket) {
        return
      }

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

    const joinMatchmaking = (username: string, region: string) => {
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
        metadata: {
          username,
          region,
        },
        matchConfirmationRequired: true,
      }

      socket.emit('joinMatchmaking', joinMatchmaking)

      addLogEntry(
        `Joining matchmaking as ${username} with server-measured ping ${currentPing}ms`,
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

    return (resultRef.current = {
      connect,
      disconnect,
      toggleConnection,
      joinMatchmaking,
      leaveMatchmaking,
      confirmMatch,
      declineMatch,
      getStats,
    })
  }, [playAudio, token])

  useInterval(getStats, matchmakingStatus === 'match-found' ? null : 1000)

  useEffect(() => {
    connect()

    return () => {
      if (firstRender.current) {
        firstRender.current = false
        return
      }
      disconnect()
    }
  }, [connect, disconnect])

  return {
    connect,
    disconnect,
    toggleConnection,
    matchmakingStatus,
    connectionStatus,
    authenticated,
    joinMatchmaking,
    leaveMatchmaking,
    confirmMatch,
    declineMatch,
    pingData,
    statistics,
    indicators,
    matchDetails,
    confirmationTimer,
    info,
  }
}

export { useMatchmakingSocket }
