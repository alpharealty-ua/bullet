import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { matchmakerSocket } from '@/socket/socket'
import {
  PingData,
  MatchmakingStatus,
  ConnectionStatus,
  Statistics,
  MatchDetails,
} from '@/socket/matchmaker/matchmaker-soket.types'
import { useInterval } from '@/hooks/use-interval'
import { notify } from '@/socket/utils'
import { MatchmakerSocketEvents } from '@/socket/matchmaker/matchmaker-socket'
import { useGameStore } from '@/store/game.store'
import { useSettingsStore } from '@/store/settings.store'
import { wait } from '@/lib/utils'
import { Indicator } from '@/components/ui/indicators'

const useMatchmakingSocket = (
  matchmakerEvents: MatchmakerSocketEvents,
  autoJoin = false,
) => {
  const queryClient = useQueryClient()
  const playSound = useSettingsStore(({ playSound }) => playSound)
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
  const [indicators, setIndicators] = useState<
    { action: Indicator; playerId: string }[]
  >([])
  const setMatchDetails = useGameStore(({ setMatchDetails }) => setMatchDetails)
  const matchDetails = useGameStore(({ matchDetails }) => matchDetails)
  const [matchId, setMatchId] = useState<string | null>(null)
  const [gameId, setGameId] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)

  const matchmakerEventsStateRef = useRef({
    matchId,
    playerId,
    matchmakingStatus,
    setMatchId,
    setPlayerId,
    setMatchmakingStatus,
  })

  useEffect(() => {
    const setMatchId = (matchId: string | null) => {
      matchmakerEventsStateRef.current.setMatchId(matchId)
      matchmakerEventsStateRef.current.matchId = matchId
    }
    const setPlayerId = (playerId: string | null) => {
      matchmakerEventsStateRef.current.setPlayerId(playerId)
      matchmakerEventsStateRef.current.playerId = playerId
    }
    const setMatchmakingStatus = (status: MatchmakingStatus) => {
      matchmakerEventsStateRef.current.setMatchmakingStatus(status)
      matchmakerEventsStateRef.current.matchmakingStatus = status
    }

    matchmakerEvents.updateEvents(async (event) => {
      const { type, payload } = event
      const { matchId, playerId, matchmakingStatus } =
        matchmakerEventsStateRef.current

      switch (type) {
        case 'connect': {
          notify('Connected to matchmaker service', 'info')
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

            setStatistics((p) => ({
              ...p,
              playersInQueue: payload.playersInQueue || 0,
            }))

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
          payload.message && notify(payload.message, 'info')

          if (matchmakingStatus === 'not-in-queue') {
            setMatchmakingStatus('searching')
            setMatchDetails(null)
          }

          setPlayerId(payload.playerId)

          return
        }
        case 'leftMatchmaking': {
          notify('You have left the matchmaking queue', 'info')

          if (matchmakingStatus === 'searching') {
            setMatchmakingStatus('not-in-queue')
          }

          setPlayerId(null)

          return
        }
        case 'matchFound': {
          notify('Match found! Please confirm to join the game.', 'success')

          setMatchmakingStatus('match-found')
          setMatchId(payload.matchId)
          setIndicators(
            payload.players.map((playerId) => ({
              playerId,
              action: 'init',
            })),
          )

          playSound('matchFound')

          if (payload.confirmationRequired) {
            const confirmationTimeoutSeconds =
              payload.confirmationTimeoutSeconds || 10

            setConfirmationTimeoutSeconds(confirmationTimeoutSeconds)
          }

          return
        }
        case 'matchConfirmationUpdate': {
          if (payload.matchId !== matchId) {
            return
          }

          setIndicators((prev) =>
            prev.map((indicator) =>
              payload.confirmedPlayers.includes(indicator.playerId)
                ? { ...indicator, action: 'confirm' }
                : { ...indicator },
            ),
          )

          return
        }
        case 'matchCanceled': {
          const status =
            payload.reason === 'player_declined' &&
            payload.declinedBy !== playerId
              ? 'searching'
              : 'not-in-queue'
          setMatchmakingStatus(status)

          playSound('matchCanceled')

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
          notify(
            'Match created successfully! Game is being prepared.',
            'success',
          )

          setMatchmakingStatus('match-created')

          playSound('matchConfirmed')

          const opponentPlayerId = payload.players.find((id) => id !== playerId)
          const metadata = payload.metadata

          const matchDetails: MatchDetails = {
            matchId: payload.matchId,
            pingDifference: Number(metadata?.pingDifference) || 0,
            averagePing: Number(metadata?.averagePing) || 0,
            opponent:
              opponentPlayerId &&
              metadata &&
              metadata.playerMetadata &&
              typeof metadata.playerMetadata === 'object' &&
              opponentPlayerId in metadata.playerMetadata &&
              metadata.playerMetadata[opponentPlayerId]
                ? metadata.playerMetadata[opponentPlayerId]
                : {
                    username: '',
                    region: '',
                    characterName: 'fatty',
                  },
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
              notify(message, 'error')
              return
            }
          }
          console.error(event, payload)
          notify('Unhandled error ' + event, 'info')
          return
        }
      }
      console.error(event)
      notify('Unhandled event ' + event.type, 'info')
    })
  }, [matchmakerEvents, playSound, queryClient, setMatchDetails])

  const toggleConnection = useCallback(() => {
    matchmakerSocket.connected
      ? matchmakerEvents.disconnect()
      : matchmakerEvents.connect()
  }, [matchmakerEvents])

  const joinMatchmaking = useCallback(() => {
    matchmakerEvents.joinMatchmaking()
  }, [matchmakerEvents])

  const leaveMatchmaking = useCallback(() => {
    const { matchmakingStatus } = matchmakerEventsStateRef.current
    if (matchmakingStatus === 'match-found') {
      notify(
        'Cannot leave matchmaking while a match confirmation is active. Please accept or decline the match first.',
        'warning',
      )
      return
    }

    matchmakerEvents.leaveMatchmaking()
  }, [matchmakerEvents])

  const confirmMatch = () => {
    if (matchId === null) {
      return
    }

    matchmakerEvents.confirmMatch(matchId)
  }

  const declineMatch = () => {
    if (matchId === null) {
      return
    }

    matchmakerEvents.declineMatch(matchId)
  }

  const getStats = () => {
    matchmakerEvents.getStats()
  }

  useInterval(getStats, matchmakingStatus === 'match-found' ? null : 1000)

  useEffect(() => {
    if (!autoJoin) {
      return
    }

    let isUnmounted = false
    let called = false
    ;(async () => {
      await wait(3000).promise
      if (isUnmounted) {
        return
      }

      called = true
      joinMatchmaking()
    })()

    return () => {
      isUnmounted = true
      if (called) {
        leaveMatchmaking()
      }
    }
  }, [autoJoin, joinMatchmaking, leaveMatchmaking])

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
    // TODO: USE REF
    indicators: indicators.map((i) => i.action),
    matchDetails,
    confirmationTimeoutSeconds,
    getStats,
    gameId,
  }
}

export { useMatchmakingSocket }
