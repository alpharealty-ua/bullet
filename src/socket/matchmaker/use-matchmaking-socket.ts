import { useEffect, useMemo, useRef, useState } from 'react'

import { socketMatchmaker as socket } from '@/socket/socket'
import { useInterval } from '@/hooks/use-interval'
import { useSettingsStore } from '@/store/settings.store'
import {
  PingData,
  MatchmakingStatus,
  ConnectionStatus,
  Indicator,
  MatchDetails,
  Info,
  Statistics,
} from '@/socket/matchmaker/matchmaker-soket.types'
import { matchmakerSocket } from '@/socket/matchmaker/matchmaker-socket'

const useMatchmakingSocket = (token: string) => {
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
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null)
  const [info, setInfo] = useState<Info>({ playerId: null, ping: 0 })
  const [gameId, setGameId] = useState<string | null>(null)
  const isUnmount = useRef(false)

  // NEED FOR HOT MODULE RELOAD
  const initState = useRef({
    currentPing: 0,
    playerId: null,
    currentMatchId: null,
    matchmakingStatus,
    authenticated,
  })

  const {
    connect,
    disconnect,
    toggleConnection,
    joinMatchmaking,
    leaveMatchmaking,
    confirmMatch,
    declineMatch,
    getStats,
  } = useMemo(
    () =>
      matchmakerSocket(
        socket,
        { token, ...initState.current },
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
          setInfo,
          setGameId,
        },
      ),
    [token, playAudio],
  )

  useInterval(getStats, matchmakingStatus === 'match-found' ? null : 1000)

  useEffect(() => {
    connect()
    isUnmount.current = true

    return () => {
      isUnmount.current = false
      Promise.resolve().then(() => {
        if (isUnmount.current) {
          return
        }
        disconnect()
      })
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
    confirmationTimeoutSeconds,
    info,
    gameId,
  }
}

export { useMatchmakingSocket }
