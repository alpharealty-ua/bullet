import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/routes/path'

import { socketDuel as socket } from '@/socket/socket'
import { showCustomAlert } from '@/socket/utils'
import { Events, DuelEvents } from '@/socket/game/duel-events'
import { useSettingsStore } from '@/store/settings.store'
import { waitEndAudio } from '@/lib/utils'
import { CharacterHandle } from '@/components/character'
import { GameBarHandle } from '@/components/duel-game-bar'
import { ReadySetPullHandle } from '@/components/ready-set-pull'
import { createTestEvents } from './test-events'

type StateGame = 'preperation' | 'running' | 'win' | 'lose' | 'draw'

export const useDuelSocket = ({
  token,
  gameId,
  playerId,
}: {
  token: string
  gameId: string
  playerId: string
}) => {
  const navigate = useNavigate()
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const [gameState, setGameState] = useState<StateGame>('preperation')
  const [pulls, setPulls] = useState<number[]>([])
  const [round, setRound] = useState(1)
  const [rematchState, setRematchState] = useState<
    'hide' | 'show' | 'requested' | 'created'
  >('hide')
  const [requestIndicator, setRequestIndicator] = useState({
    player: false,
    opponnent: false,
  })
  const frontCharacterHandleRef = useRef<CharacterHandle>(null)
  const backCharacterHandleRef = useRef<CharacterHandle>(null)
  const gameBarRefHandle = useRef<GameBarHandle>(null)
  const readySetPullHandleRef = useRef<ReadySetPullHandle>(null)
  const hasPull = !pulls.includes(round)

  const opponentPull = useCallback(async (shot: boolean) => {
    await frontCharacterHandleRef.current?.frontGunHandleRef?.current?.trigger()
    await frontCharacterHandleRef.current?.frontGunHandleRef?.current?.spin()
    await frontCharacterHandleRef.current?.frontGunHandleRef?.current?.click()
    shot &&
      (await frontCharacterHandleRef.current?.frontGunHandleRef?.current?.shot())
  }, [])

  const playerPull = useCallback(async (shot: boolean) => {
    await backCharacterHandleRef.current?.backGunHandleRef?.current?.trigger()
    await backCharacterHandleRef.current?.backGunHandleRef?.current?.spin()
    await backCharacterHandleRef.current?.backGunHandleRef?.current?.click()
    shot &&
      (await backCharacterHandleRef.current?.backGunHandleRef?.current?.shot())
  }, [])

  const joinDuelGame = useCallback(() => {
    type JoinPayload = { gameId: string; playerId: string }

    const payload: JoinPayload = {
      gameId,
      playerId,
    }

    socket.emit('game:join', payload)
  }, [gameId, playerId])

  const requestRematch = () => {
    type RequestRematch = { gameId: string; playerId: string }

    const payload: RequestRematch = {
      gameId,
      playerId,
    }

    socket.emit('game:request_rematch', payload)
  }

  const leaveDuelGame = useCallback(() => {
    showCustomAlert(`Leaving duel game ${gameId}...`, 'info')

    type LeaveRematch = { gameId: string; playerId: string }

    const payload: LeaveRematch = {
      gameId,
      playerId,
    }

    socket.emit('game:leave', payload)
  }, [gameId, playerId])

  const newGame = useCallback(async () => {
    const gameBarHandle = gameBarRefHandle.current
    const frontCharacterHandle = frontCharacterHandleRef.current
    const backCharacterHandle = backCharacterHandleRef.current

    if (gameBarHandle) {
      await gameBarHandle.reset()
    }
    if (frontCharacterHandle) {
      await frontCharacterHandle.reset()
    }
    if (backCharacterHandle) {
      await backCharacterHandle.reset()
    }
    setGameState('preperation')
  }, [])

  const gameOver = useCallback(async () => {
    setGameState('lose')
  }, [])

  const winGame = useCallback(async () => {
    setGameState('win')

    const winSoundAudio = await playAudio('winsound', false)
    const chachingAudio = await playAudio('chaching', false)

    const startAudio = await new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(false), 100)
      chachingAudio.addEventListener('play', () => resolve(true))
    })

    startAudio && (await waitEndAudio(chachingAudio))
    startAudio && (await waitEndAudio(winSoundAudio))
  }, [playAudio])

  const drawGame = useCallback(() => {
    setGameState('draw')
  }, [])

  const showResult = useRef(false)

  const callback = useCallback(
    async (event: Events) => {
      const { type, payload } = event
      switch (type) {
        case 'connect': {
          showCustomAlert('Connected to duel game service', 'info')
          joinDuelGame()
          return
        }
        case 'connect_error': {
          break
        }
        case 'disconnect': {
          break
        }
        case 'game:joined': {
          const { game } = payload
          if (payload.game.status === 'completed') {
            showCustomAlert('The game is already completed.', 'info')

            setRound(game.currentRound)

            const winPlayer = game.players.find((p) => p.status === 'alive')

            const isWin = winPlayer && winPlayer.id === playerId

            isWin ? await winGame() : await gameOver()

            return
          }
          showCustomAlert(payload.message, 'info')
          return
        }
        case 'game:reconnected': {
          break
        }
        case 'game:round_started':
        case 'game:round_current': {
          setRound(payload.roundNumber)
          setGameState('running')
          return
        }
        case 'game:ready':
        case 'game:take':
        case 'game:pull': {
          readySetPullHandleRef.current?.start(payload)

          return
        }
        case 'game:pull_result': {
          showCustomAlert(payload.message, 'info')

          const isPlayer = playerId === payload.playerId

          const pull = isPlayer ? playerPull : opponentPull

          if (isPlayer) {
            await gameBarRefHandle.current?.highlight(payload.index)
          }

          showResult.current = payload.fired
          await pull(payload.fired)

          if (payload.fired) {
            isPlayer ? winGame() : gameOver()
          }
          return
        }
        case 'game:player_won': {
          const isWin = payload.playerId === playerId
          showCustomAlert(payload.message, isWin ? 'success' : 'error')
          return
        }
        case 'game:ended': {
          if (payload.winner) {
            const isWin = payload.winner.id === playerId
            showCustomAlert(payload.message, isWin ? 'success' : 'error')
          } else {
            showCustomAlert(payload.message, 'info')
            drawGame()
          }
          setRematchState('show')
          return
        }
        case 'probability': {
          gameBarRefHandle.current?.setActive(payload.index)
          return
        }
        case 'game:rematch_requested': {
          const isI = payload.playerId === playerId
          isI
            ? setRequestIndicator((p) => ({ ...p, player: true }))
            : setRequestIndicator((p) => ({ ...p, opponnent: true }))
          setRematchState('requested')
          showCustomAlert(payload.message, 'info')
          return
        }
        case 'game:rematch_created': {
          setRequestIndicator({ opponnent: true, player: true })
          setRematchState('created')
          setGameState('preperation')
          showCustomAlert(payload.message, 'info')
          const rematchGameId = payload.rematchGame.id
          console.log('navigate ', rematchGameId)
          navigate(`${ROUTES.duel.play}/${rematchGameId}`, {
            preventScrollReset: true,
          })
          return
        }
        case 'game:rematch_cancelled': {
          break
        }
        case 'game:countdown_update': {
          console.log('game:countdown_update')
          return
        }
        case 'game:player_left':
        case 'game:player_disconnected': {
          break
        }
        case 'error': {
          const { event } = payload
          switch (event) {
            case 'game:join':
            case 'game:pull_trigger':
            case 'game:request_rematch':
              showCustomAlert(payload.message, 'error')
              return
          }
          console.error(payload)
          showCustomAlert('Unhandled error ' + event, 'info')
          return
        }
      }
      console.error(event)
      showCustomAlert('Unhandled event ' + event.type, 'info')
    },
    [
      drawGame,
      gameOver,
      joinDuelGame,
      navigate,
      opponentPull,
      playerId,
      playerPull,
      winGame,
    ],
  )

  const refCallback = useRef(callback)

  useEffect(() => {
    refCallback.current = callback
  }, [callback])

  const duelEvents = useMemo(() => {
    return new DuelEvents(refCallback)
  }, [])

  // @ts-ignore
  const testEvents = createTestEvents(playerId)

  const pullTrigger = async () => {
    setPulls((p) => [...p, round])

    const payload = {
      gameId,
      playerId,
    }

    socket.emit('game:pull_trigger', payload)
  }

  const isUnmounted = useRef(false)

  const connect = useCallback(() => {
    try {
      socket.auth = { token }
      socket.connect()
    } catch (error) {
      console.error(`Error connecting to duel game service:`, error)
    }
  }, [token])

  const disconnect = useCallback(() => {
    leaveDuelGame()
    socket.disconnect()
    showCustomAlert(`Disconnected from duel game service`, 'info')
  }, [leaveDuelGame])

  useEffect(() => {
    connect()
    duelEvents.attachEventListeners()
    isUnmounted.current = false

    return () => {
      duelEvents.dettachEventListeners()
      isUnmounted.current = true
      Promise.resolve().then(() => {
        if (!isUnmounted.current) {
          return
        }
        disconnect()
      })
    }
  }, [duelEvents, connect, disconnect])

  return {
    frontCharacterHandleRef,
    backCharacterHandleRef,
    gameBarRefHandle,
    readySetPullHandleRef,
    joinDuelGame,
    pullTrigger,
    gameState,
    isStartedGame: gameState === 'running',
    hasPull,
    newGame,
    round,
    requestRematch,
    rematchState,
    requestIndicator,
    leaveDuelGame,
  }
}
