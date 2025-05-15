import { useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { matchmakerEvents } from '@/socket/socket'
import { MatchmakerEventList } from '@/socket/matchmaker/matchmaker-socket-events'
import {
  MatchDetails,
  AdditionalPlayerMetadata,
} from '@/socket/matchmaker/matchmaker-soket.types'
import { useInterval } from '@/hooks/use-interval'
import { notify } from '@/socket/utils'
import { useSettingsStore } from '@/store/settings.store'
import { useMatchmakerStore } from '@/store/matchmaker.store'
import { wait } from '@/lib/utils'

const useMatchmakingSocket = ({
  autoJoin,
  metadata,
}: {
  autoJoin: boolean
  metadata: AdditionalPlayerMetadata
}) => {
  const queryClient = useQueryClient()
  const playSound = useSettingsStore(({ playSound }) => playSound)

  useEffect(() => {
    const handle = async (event: MatchmakerEventList) => {
      const { type, payload } = event
      const { matchId, playerId, matchmakingStatus } =
        useMatchmakerStore.getState()

      switch (type) {
        case 'connect': {
          notify('Connected to matchmaker service', 'info')
          useMatchmakerStore.setState({
            connectionStatus: 'authenticating',
            gameId: null,
          })
          return
        }
        case 'connect_error': {
          useMatchmakerStore.setState({ connectionStatus: 'disconnected' })
          break
        }
        case 'disconnect': {
          useMatchmakerStore.setState(useMatchmakerStore.getInitialState())
          return
        }
        case 'pingData': {
          useMatchmakerStore.setState({
            pingData: payload,
          })
          return
        }
        case 'info': {
          if (payload.authenticated) {
            const prevStatistics = useMatchmakerStore.getState().statistics
            useMatchmakerStore.setState({
              authenticated: true,
              connectionStatus: 'authenticated',
              statistics: {
                ...prevStatistics,
                playersInQueue: payload.playersInQueue || 0,
              },
            })

            if (payload.currentPing) {
              const prevPingData = useMatchmakerStore.getState().pingData
              useMatchmakerStore.setState({
                pingData: {
                  ...prevPingData,
                  ping: payload.currentPing ?? prevPingData.ping,
                  jitter: payload.currentJitter ?? prevPingData.jitter,
                  measurements:
                    payload.measurementsCount || prevPingData.measurements,
                },
              })
            }
          }

          useMatchmakerStore.setState({
            authenticated: payload.authenticated,
            connectionStatus: payload.authenticated
              ? 'authenticated'
              : 'not-authenticated',
          })
          return
        }
        case 'joinedMatchmaking': {
          notify('You have Joined the matchmaking queue', 'success')

          if (matchmakingStatus === 'not-in-queue') {
            useMatchmakerStore.setState({
              matchmakingStatus: 'searching',
              matchDetails: null,
              playerId: payload.playerId,
            })
          }

          return
        }
        case 'leftMatchmaking': {
          notify('You have left the matchmaking queue', 'info')

          useMatchmakerStore.setState({
            matchmakingStatus:
              matchmakingStatus === 'searching' ? 'not-in-queue' : undefined,
            playerId: payload.playerId,
          })

          return
        }
        case 'matchFound': {
          notify('Match found! Please confirm to join the game.', 'success')

          playSound('matchFound')

          useMatchmakerStore.setState({
            matchmakingStatus: 'match-found',
            matchId: payload.matchId,
            indicators: payload.players.map((playerId) => ({
              playerId,
              action: 'init',
            })),
            confirmationTimeoutSeconds: payload.confirmationRequired
              ? payload.confirmationTimeoutSeconds || 10
              : undefined,
          })

          return
        }
        case 'matchConfirmationUpdate': {
          if (payload.matchId !== matchId) {
            return
          }

          const prevIndicators = useMatchmakerStore.getState().indicators
          useMatchmakerStore.setState({
            indicators: prevIndicators.map((indicator) =>
              payload.confirmedPlayers.includes(indicator.playerId)
                ? { ...indicator, action: 'confirm' }
                : { ...indicator },
            ),
          })

          return
        }
        case 'matchCanceled': {
          const reason =
            payload.reason === 'confirmation_timeout'
              ? 'Not all players confirmed in time'
              : payload.reason === 'player_declined'
                ? 'A player declined the match'
                : 'Unknown reason'
          notify(`Match canceled: ${reason}`, 'warning')

          playSound('matchCanceled')

          const status =
            payload.reason === 'player_declined' &&
            payload.declinedBy !== playerId
              ? 'searching'
              : 'not-in-queue'

          useMatchmakerStore.setState({
            matchmakingStatus: status,
          })

          return
        }
        case 'matchCreated': {
          notify(
            'Match created successfully! Game is being prepared.',
            'success',
          )

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

          useMatchmakerStore.setState({
            matchmakingStatus: 'match-created',
            matchDetails,
            matchId: null,
          })

          return
        }
        case 'duelGameCreated': {
          useMatchmakerStore.setState({
            gameId: payload.gameId,
          })
          return
        }
        case 'stats': {
          useMatchmakerStore.setState({
            statistics: {
              playersInQueue: payload.playersInQueue || 0,
              totalMatches: payload.totalMatches || 0,
              averageWaitTime: Math.round(payload.averageWaitTime || 0),
            },
          })
          return
        }
        case 'error': {
          const { event, message } = payload

          switch (message) {
            case 'Authentication failed': {
              notify(message, 'error')

              useMatchmakerStore.setState({
                connectionStatus: 'authentication-failed',
                authenticated: false,
              })

              return
            }
            case 'Cannot leave matchmaking while a match confirmation is pending': {
              notify(message, 'error')
              return
            }
            case 'Not in matchmaking': {
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
      notify('Unhandled event ' + event, 'info')
    }

    matchmakerEvents.addEventsListener(handle)

    return () => {
      matchmakerEvents.removeEventsListener(handle)
    }
  }, [playSound, queryClient])

  const joinMatchmaking = useCallback(() => {
    matchmakerEvents.joinMatchmaking(metadata)
  }, [metadata])

  const leaveMatchmaking = useCallback(() => {
    matchmakerEvents.leaveMatchmaking()
  }, [])

  const confirmMatch = () => {
    const matchId = useMatchmakerStore.getState().matchId

    if (matchId === null) {
      return
    }

    matchmakerEvents.confirmMatch(matchId)
  }

  const declineMatch = () => {
    const matchId = useMatchmakerStore.getState().matchId

    if (matchId === null) {
      return
    }

    matchmakerEvents.declineMatch(matchId)
  }

  const getStats = () => {
    matchmakerEvents.getStats()
  }

  useInterval(getStats, 1000)

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
    joinMatchmaking,
    leaveMatchmaking,
    declineMatch,
    confirmMatch,
  }
}

export { useMatchmakingSocket }
