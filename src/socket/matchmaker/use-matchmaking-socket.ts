import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { socketMatchmaker as socket } from '@/socket/socket'
import {
  PingData,
  MatchmakingStatus,
  ConnectionStatus,
  Indicator,
  Statistics,
  AdditionalPlayerMetadata,
  JoinMatchmaking,
  MatchDetails,
} from '@/socket/matchmaker/matchmaker-soket.types'
import { useInterval } from '@/hooks/use-interval'
import { addLogEntry, notify } from '@/socket/utils'
import { MatchmakerSocketEvents } from '@/socket/matchmaker/matchmaker-socket'
import { useGameStore } from '@/store/game.store'
import { useSettingsStore } from '@/store/settings.store'

const useMatchmakingSocket = (token: string) => {
  const autoConnect = useSettingsStore(({ autoConnect }) => autoConnect)
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const [pingData, setPingData] = useState<PingData>({
    ping: 0,
    jitter: 0,
    measurements: 0,
    history: [],
    sequence: 0,
  })
  const [statistics, setStatistics] = useState<Statistics>({
    playersInQueue: 0,
    totalMatches: 0,
    averageWaitTime: 0,
  })
  const [confirmationTimeoutSeconds, setConfirmationTimeoutSeconds] =
    useState(0)
  const [matchmakingStatus, setMatchmakingStatus] =
    useState<MatchmakingStatus>('not-in-queue')
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected')
  const [authenticated, setAuthenticated] = useState(false)
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const setMatchDetails = useGameStore(({ setMatchDetails }) => setMatchDetails)
  const matchDetails = useGameStore(({ matchDetails }) => matchDetails)
  const [currentMatchId, setMatchId] = useState<string | null>(null)
  const [gameId, setGameId] = useState<string | null>(null)
  const isUnmounted = useRef(false)
  const currentPing = pingData.ping
  const [playerId, setPlayerId] = useState<string | null>(null)

  const matchmakerEvents = useMemo(
    () => new MatchmakerSocketEvents(socket, token),
    [token],
  )

  // TODO: REFACTOR
  const refState = useRef({
    currentMatchId,
    matchmakingStatus,
  })
  refState.current.currentMatchId = currentMatchId
  refState.current.matchmakingStatus = matchmakingStatus

  useEffect(() => {
    matchmakerEvents.updateEvents(async (event) => {
      const { type, payload } = event
      const { currentMatchId, matchmakingStatus } = refState.current

      switch (type) {
        case 'connect': {
          notify('Connected to duel game service', 'info')
          setConnectionStatus('authenticating')
          setGameId(null)
          return
        }
        case 'connect_error': {
          setConnectionStatus('disconnected')
          break
        }
        // TODO: NEVER CALL - COMPONENT ALREADY UNMOUNTED AND DETACH ALL EVENTS
        case 'disconnect': {
          setConnectionStatus('disconnected')
          setMatchmakingStatus('not-in-queue')
          refState.current.matchmakingStatus = 'not-in-queue'

          setPingData({
            ping: 0,
            jitter: 0,
            measurements: 0,
            history: [],
            sequence: 0,
          })
          setAuthenticated(false)
          setGameId(null)
          return
        }
        case 'pingData': {
          setPingData(payload)
          return
        }
        case 'info': {
          if (payload.authenticated) {
            setAuthenticated(true)
            setConnectionStatus('authenticated')

            // Update stats
            setStatistics((p) => ({
              ...p,
              playersInQueue: payload.playersInQueue || 0,
            }))

            // Update ping if available
            if (payload.currentPing) {
              setPingData((p) => ({
                ...p,
                ping: payload.currentPing ?? p.ping,
                jitter: payload.currentJitter ?? p.jitter,
                measurements: payload.measurementsCount || p.measurements,
              }))
            }
          } else {
            setAuthenticated(false)
            setConnectionStatus('not-authenticated')
          }
          return
        }
        case 'joinedMatchmaking': {
          notify('You have Joined the matchmaking queue', 'success')

          // Update matchmaking status
          if (matchmakingStatus === 'not-in-queue') {
            setMatchmakingStatus('searching')
            refState.current.matchmakingStatus = 'searching'
            setMatchDetails(null)
          }

          setPlayerId(payload.playerId)

          // Log if this is a re-join after match cancellation
          if (
            payload.message &&
            payload.message.includes('Returned to matchmaking after')
          ) {
            notify(payload.message, 'info')
          }
          return
        }
        case 'leftMatchmaking': {
          notify('You have left the matchmaking queue', 'info')

          setMatchmakingStatus('not-in-queue')
          refState.current.matchmakingStatus = 'not-in-queue'

          setPlayerId(null)

          return
        }
        case 'matchFound': {
          // Show a notification
          notify('Match found! Please confirm to join the game.', 'success')

          // Update matchmaking status
          setMatchmakingStatus('match-found')
          refState.current.matchmakingStatus = 'match-found'

          setMatchId(payload.matchId)

          // Create player confirmation indicators
          setIndicators(
            payload.players.map((playerId) => ({ playerId, confirm: false })),
          )

          // Play match found sound
          playAudio('matchFound')

          // TODO: SET ALL RESPONSE DATA
          if (payload.confirmationRequired) {
            const confirmationTimeoutSeconds =
              payload.confirmationTimeoutSeconds || 10

            setConfirmationTimeoutSeconds(confirmationTimeoutSeconds)
          }

          return
        }
        case 'matchConfirmationUpdate': {
          if (payload.matchId !== currentMatchId) {
            return
          }

          // Update player confirmation indicators
          setIndicators((prevIndicators) =>
            prevIndicators.map((indicator) => ({
              ...indicator,
              confirm: payload.confirmedPlayers.includes(indicator.playerId),
            })),
          )

          return
        }
        case 'matchCanceled': {
          // Update matchmaking status based on whether the player was returned to queue
          const status =
            payload.reason === 'player_declined' &&
            payload.declinedBy !== playerId
              ? 'searching'
              : 'not-in-queue'
          setMatchmakingStatus(status)
          refState.current.matchmakingStatus = status

          // Play match canceled sound
          playAudio('matchCanceled')

          // Show reason in a more user-friendly way
          let reason = 'Unknown reason'
          if (payload.reason === 'confirmation_timeout') {
            reason = 'Not all players confirmed in time'
          } else if (payload.reason === 'player_declined') {
            reason = 'A player declined the match'
          }

          notify(`Match canceled: ${reason}`, 'warning')

          return
        }
        case 'matchCreated': {
          // Update matchmaking status

          setMatchmakingStatus('match-created')
          refState.current.matchmakingStatus = 'match-created'

          playAudio('matchConfirmed')

          // Show a notification
          notify(
            'Match created successfully! Game is being prepared.',
            'success',
          )

          // Find opponent's player ID
          const opponentPlayerId = payload.players.find((id) => id !== playerId)

          const matchDetails: MatchDetails = {
            matchId: payload.matchId,
            pingDifference: payload.metadata?.pingDifference ?? '',
            averagePing: payload.metadata?.averagePing ?? '',
            gameId: payload.metadata?.gameId ?? '',
            opponent: {
              ping: 0,
              username: '',
              region: '',
              characterName: 'fatty',
            },
          }

          // Set opponent details if available
          if (opponentPlayerId && payload.metadata?.playerMetadata) {
            const opponentData =
              payload.metadata.playerMetadata[opponentPlayerId]
            if (opponentData) {
              // TODO: FIX ANY
              matchDetails.opponent.ping = opponentData.ping ?? '--'
              matchDetails.opponent.username = opponentData.username ?? ''
              matchDetails.opponent.region = opponentData.region ?? ''
              matchDetails.opponent.characterName =
                opponentData.characterName ?? ''
            }
          }

          setMatchDetails(matchDetails)
          setMatchId(null)

          return
        }
        case 'duelGameCreated': {
          setGameId(payload.gameId)
          return
        }
        case 'stats': {
          setStatistics({
            playersInQueue: payload.playersInQueue || 0,
            totalMatches: payload.totalMatches || 0,
            averageWaitTime: Math.round(payload.averageWaitTime || 0),
          })
          return
        }
        case 'error': {
          const { event, message } = payload

          switch (message) {
            case 'Authentication failed': {
              notify(message, 'error')
              setConnectionStatus('authentication-failed')
              setAuthenticated(false)
              return
            }
            case 'Cannot leave matchmaking while a match confirmation is pending': {
              // Re-enable the leave button if the server rejected the leave request
              return
            }
          }
          console.error(payload)
          notify('Unhandled error ' + event, 'info')
          return
        }
      }
      console.error(event)
      notify('Unhandled event ' + event.type, 'info')
    })
  }, [matchmakerEvents, playAudio, playerId, setMatchDetails])

  const toggleConnection = useCallback(() => {
    socket.connected
      ? matchmakerEvents.disconnect()
      : matchmakerEvents.connect()
  }, [matchmakerEvents])

  const joinMatchmaking = (metadata: AdditionalPlayerMetadata) => {
    if (!socket || !socket.connected || !authenticated) {
      addLogEntry('Not connected or authenticated', 'error')
      notify('Not connected or authenticated', 'error')
      return
    }

    // Check if ping is too high
    if (currentPing > 500) {
      addLogEntry(
        `Cannot join matchmaking: ping too high (${currentPing}ms)`,
        'error',
      )
      notify(
        `Cannot join matchmaking: ping too high (${currentPing}ms)`,
        'error',
      )
      return
    }

    const joinMatchmaking: JoinMatchmaking = {
      betOptions: {
        networkId: 'local',
        coinId: 'usd',
        betAmount: '0.01',
        maxRounds: 10,
      },
      metadata,
      matchConfirmationRequired: false,
    }

    matchmakerEvents.joinMatchmaking(joinMatchmaking)
  }

  const leaveMatchmaking = () => {
    if (matchmakingStatus === 'match-found') {
      addLogEntry(
        'Cannot leave matchmaking while a match confirmation is active',
        'warning',
      )
      notify(
        'Cannot leave matchmaking while a match confirmation is active. Please accept or decline the match first.',
        'warning',
      )
      return
    }

    matchmakerEvents.leaveMatchmaking()
  }

  const confirmMatch = () => {
    if (currentMatchId === null) {
      return
    }

    matchmakerEvents.confirmMatch(currentMatchId)
  }

  const declineMatch = () => {
    if (currentMatchId === null) {
      return
    }

    matchmakerEvents.declineMatch(currentMatchId)
  }

  const getStats = () => {
    matchmakerEvents.getStats()
  }

  useEffect(() => {
    if (!autoConnect) {
      return
    }

    matchmakerEvents.connect()
    matchmakerEvents.attachEventListeners()
    isUnmounted.current = false

    return () => {
      matchmakerEvents.dettachEventListeners()

      isUnmounted.current = true
      queueMicrotask(() => {
        if (!isUnmounted.current) {
          return
        }

        matchmakerEvents.disconnect()
      })
    }
  }, [matchmakerEvents, autoConnect])

  useInterval(getStats, matchmakingStatus === 'match-found' ? null : 1000)

  return {
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
    confirmationTimeoutSeconds,
    getStats,
    gameId,
  }
}

export { useMatchmakingSocket }
