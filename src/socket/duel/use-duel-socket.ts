import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/api/api'
import { ROUTES } from '@/routes/path'
import { socketDuel as socket } from '@/socket/socket'
import { DuelSocketEvents } from '@/socket/duel/duel-socket-events'
import { useGameStore } from '@/store/game.store'
import { notify } from '@/socket/utils'
import { wait } from '@/lib/utils'
import { TIME_WIN_INCREASE_NUMBER } from '@/lib/constants'
import { CharacterHandle, CharacterState } from '@/components/character'
import { GameBarHandle } from '@/components/duel-game-bar'
import { ReadySetPullHandle } from '@/components/ready-set-pull'
import { VictoryHandle } from '@/components/victory'

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
  const isUnmounted = useRef(false)
  const queryClient = useQueryClient()
  const setIncreaseTime = useGameStore(({ setIncreaseTime }) => setIncreaseTime)
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
  const victoryHandleRef = useRef<VictoryHandle>(null)
  const frontCharacterHandleRef = useRef<CharacterHandle>(null)
  const backCharacterHandleRef = useRef<CharacterHandle>(null)
  const gameBarRefHandle = useRef<GameBarHandle>(null)
  const readySetPullHandleRef = useRef<ReadySetPullHandle>(null)
  const hasPull = !pulls.includes(round)

  const duelSocketEvents = useMemo(
    () => new DuelSocketEvents(socket, token, gameId, playerId),
    [token, gameId, playerId],
  )

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

  const requestRematch = () => {
    type RequestRematch = { gameId: string; playerId: string }

    const payload: RequestRematch = {
      gameId,
      playerId,
    }

    socket.emit('game:request_rematch', payload)
  }

  const reset = useCallback(async () => {
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
  }, [])

  const newGame = useCallback(async () => {
    setGameState('preperation')
  }, [])

  const gameOver = useCallback(async () => {
    await backCharacterHandleRef?.current?.updateState('eliminated')
    await frontCharacterHandleRef?.current?.updateState('winner')
    setGameState('lose')
  }, [])

  const winGame = useCallback(
    async (characterState: CharacterState = 'eliminated') => {
      setGameState('win')
      setIncreaseTime(TIME_WIN_INCREASE_NUMBER)

      const genRunSound = victoryHandleRef.current?.runSound()

      await frontCharacterHandleRef?.current?.updateState(characterState)
      await backCharacterHandleRef?.current?.updateState('winner')
      await victoryHandleRef.current?.updateState({
        show: true,
        type: 'win',
        oldLevel: 722,
        newLevel: 754,
      })
      await genRunSound?.next()
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
      await genRunSound?.next()

      setIncreaseTime(undefined)
      await victoryHandleRef.current?.updateState({
        show: false,
      })
      await frontCharacterHandleRef?.current?.updateState('alive')
      await backCharacterHandleRef?.current?.updateState('alive')
    },
    [queryClient, setIncreaseTime],
  )

  const drawGame = useCallback(async () => {
    await frontCharacterHandleRef?.current?.updateState('alive')
    await backCharacterHandleRef?.current?.updateState('alive')
    await victoryHandleRef.current?.updateState({ show: true, type: 'draw' })
    await wait(2000).promise

    await victoryHandleRef.current?.updateState({ show: false })
  }, [])

  const pullTrigger = async () => {
    setPulls((p) => [...p, round])

    duelSocketEvents.pullTrigger()
  }

  useEffect(() => {
    duelSocketEvents.updateEvents(async (event) => {
      const { type, payload } = event
      switch (type) {
        case 'connect': {
          notify('Connected to duel game service', 'info')
          duelSocketEvents.joinDuelGame()
          return
        }
        case 'connect_error': {
          break
        }
        // TODO: NEVER CALL - COMPONENT ALREADY UNMOUNTED AND DETACH ALL EVENTS
        case 'disconnect': {
          return
        }
        case 'game:joined': {
          const { game } = payload
          if (payload.game.status === 'completed') {
            notify('The game is already completed.', 'info')

            setRound(game.currentRound)

            const winPlayer = game.players.find((p) => p.status === 'alive')

            const isWin = winPlayer && winPlayer.id === playerId

            isWin ? await winGame() : await gameOver()

            setRematchState('show')

            return
          }
          notify(payload.message, 'info')
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
          if (payload.roundNumber === 1) {
            readySetPullHandleRef.current?.start(payload.event)
          }

          return
        }
        case 'game:pull_result': {
          notify(payload.message, 'info')

          const isPlayer = playerId === payload.playerId

          const pull = isPlayer ? playerPull : opponentPull

          if (payload.fired) {
            await gameBarRefHandle.current?.setActive(payload.index)
          }

          if (isPlayer) {
            await gameBarRefHandle.current?.highlight(payload.index)
          }

          await pull(payload.fired)

          if (payload.fired) {
            isPlayer ? winGame() : gameOver()
          }
          return
        }
        case 'game:player_won': {
          const isWin = payload.playerId === playerId
          notify(payload.message, isWin ? 'success' : 'error')
          return
        }
        case 'game:ended': {
          if (payload.winner) {
            const isWin = payload.winner.id === playerId
            notify(payload.message, isWin ? 'success' : 'error')
          } else {
            notify(payload.message, 'info')
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
          const isPlayer = payload.playerId === playerId
          isPlayer
            ? setRequestIndicator((p) => ({ ...p, player: true }))
            : setRequestIndicator((p) => ({ ...p, opponnent: true }))
          setRematchState('requested')
          notify(payload.message, 'info')
          return
        }
        case 'game:rematch_created': {
          setRequestIndicator({ opponnent: true, player: true })
          setRematchState('created')
          setGameState('preperation')
          notify(payload.message, 'info')
          const rematchGameId = payload.rematchGame.id
          navigate(`${ROUTES.duel.play}/${rematchGameId}`, {
            preventScrollReset: true,
          })
          return
        }
        case 'game:rematch_cancelled': {
          setRequestIndicator({ opponnent: false, player: true })
          return
        }
        case 'game:countdown_update': {
          console.log('game:countdown_update')
          return
        }
        case 'game:player_left': {
          await winGame('left')
          return
        }
        case 'game:player_disconnected': {
          return
        }
        case 'error': {
          const { event } = payload
          switch (event) {
            case 'game:join':
            case 'game:pull_trigger':
            case 'game:request_rematch':
              if (event === 'game:pull_trigger') {
                setPulls((p) => p.filter((_, i, arr) => i !== arr.length - 1))
              }
              notify(payload.message, 'error')
              return
          }
          console.error(payload)
          notify('Unhandled error ' + event, 'info')
          return
        }
      }
      console.error(event)
      notify('Unhandled event ' + event.type, 'info')
    })
  }, [
    duelSocketEvents,
    playerId,
    winGame,
    gameOver,
    playerPull,
    opponentPull,
    drawGame,
    navigate,
  ])

  useEffect(() => {
    isUnmounted.current = false

    duelSocketEvents.connect()
    duelSocketEvents.attachEventListeners()

    return () => {
      isUnmounted.current = true

      duelSocketEvents.dettachEventListeners()

      queueMicrotask(() => {
        if (!isUnmounted.current) {
          return
        }

        duelSocketEvents.disconnect()
      })
    }
  }, [duelSocketEvents])

  return {
    victoryHandleRef,
    frontCharacterHandleRef,
    backCharacterHandleRef,
    gameBarRefHandle,
    readySetPullHandleRef,
    pullTrigger,
    requestRematch,
    reset,
    gameState,
    hasPull,
    newGame,
    round,
    rematchState,
    requestIndicator,
  }
}
