import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { socketMatchmaker as socket } from '@/socket/socket'
import { addLogEntry, debug, showCustomAlert } from '@/socket/utils'
import { matchmakerSocket } from '@/socket/matchmaker/matchmaker-socket'
import { useInterval } from '@/hooks/use-interval'
import { useSettingsStore } from '@/store/settings.store'
import {
  PingData,
  MatchmakingStatus,
  ConnectionStatus,
  Indicator,
  Info,
  Statistics,
  AdditionalPlayerMetadata,
  JoinMatchmaking,
} from '@/socket/matchmaker/matchmaker-soket.types'
import { useGameStore } from '@/store/game.store'

const useMatchmakingSocket = (
  token: string,
  {
    username,
    characterName,
    region,
  }: { username: string; characterName: string; region: string },
) => {
  const autoConnect = useSettingsStore(({ autoConnect }) => autoConnect)
  const autoJoin = useSettingsStore(({ autoJoin }) => autoJoin)
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
  const [info, setInfo] = useState<Info>({ playerId: null, ping: 0 })
  const [currentMatchId, setMatchId] = useState<string | null>(null)
  const [gameId, setGameId] = useState<string | null>(null)
  const isUnmounted = useRef(false)
  const currentPing = info.ping

  const initState = useMemo(
    () => ({
      token,
      currentPing: 0,
      playerId: null,
      currentMatchId: null,
      matchmakingStatus,
      authenticated,
    }),
    // INIT STATE NEED FOR HOT MODULE RELOAD
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token],
  )
  const offRef = useRef(() => {})

  const on = useMemo(
    () =>
      matchmakerSocket(socket, {
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
        setMatchId,
        setGameId,
      }),
    [playAudio, setMatchDetails],
  )

  const connect = useCallback(() => {
    socket.auth = { token }
    socket.connect()
    offRef.current = on(initState)
  }, [token, on, initState])

  const disconnect = useCallback(() => {
    socket.disconnect()
  }, [])

  const toggleConnection = useCallback(() => {
    socket.connected ? disconnect() : connect()
  }, [connect, disconnect])

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

    socket.emit('joinMatchmakingWithBet', joinMatchmaking)

    addLogEntry(
      `Joining matchmaking as ${metadata.username} with server-measured ping ${currentPing}ms`,
      'info',
    )
  }

  const leaveMatchmaking = () => {
    if (!socket.connected) {
      addLogEntry('Not connected', 'error')
      showCustomAlert('Not connected', 'error')
      return
    }

    // Check if a match confirmation is active
    if (matchmakingStatus === 'match-found') {
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
    if (!socket.connected || !authenticated || !currentMatchId) {
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
    })
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
  }

  const getStats = () => {
    if (!socket || !socket.connected || !authenticated) {
      addLogEntry('Not connected or authenticated', 'error')
      return
    }

    socket.emit('getStats')
    addLogEntry('Requesting matchmaking stats', 'info')
  }

  useEffect(() => {
    if (!autoConnect) {
      return
    }

    connect()
    isUnmounted.current = false

    return () => {
      offRef.current()

      isUnmounted.current = true
      Promise.resolve().then(() => {
        if (!isUnmounted.current) {
          return
        }

        disconnect()
      })
    }
  }, [connect, disconnect, autoConnect])

  useEffect(() => {
    if (!autoJoin) {
      return
    }

    if (!authenticated) {
      return
    }

    joinMatchmaking({
      username,
      characterName,
      region,
    })

    return () => {
      leaveMatchmaking()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, username, characterName, region, autoJoin])

  useInterval(getStats, matchmakingStatus === 'match-found' ? null : 1000)

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
    getStats,
    gameId,
  }
}

export { useMatchmakingSocket }
