import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/api/api'
import { ROUTES } from '@/routes/path'
import { useUnmountedState } from '@/hooks/use-unmount-state'
import { socketDuel as socket } from '@/socket/socket'
import { DuelSocketEvents } from '@/socket/duel/duel-socket-events'
import { useGameStore } from '@/store/game.store'
import { notify } from '@/socket/utils'
import { wait } from '@/lib/utils'
import { TIME_WIN_INCREASE_NUMBER } from '@/lib/constants'
import { CharacterHandle } from '@/components/character'
import { GameBarHandle } from '@/components/duel-game-bar'
import { ReadySetPullHandle } from '@/components/ready-set-pull'
import { VictoryHandle } from '@/components/victory'
import { GameOverHandle } from '@/components/game-over'
import { RematchRequestHandle } from '@/components/rematch-request'
import { Indicator } from '@/components/indicators'

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
  const isUnmounted = useUnmountedState()
  const queryClient = useQueryClient()
  const setIncreaseTime = useGameStore(({ setIncreaseTime }) => setIncreaseTime)
  const [pulls, setPulls] = useState<number[]>([])
  const [round, setRound] = useState(1)
  const [_, setRematchState] = useState<'hide' | 'requested' | 'created'>(
    'hide',
  )
  const [requestIndicator, setRequestIndicator] = useState<
    Record<'player' | 'opponnent', Indicator>
  >({
    player: { confirm: undefined, cancel: undefined },
    opponnent: { confirm: undefined, cancel: undefined },
  })
  const gameOverHandleRef = useRef<GameOverHandle>(null)
  const victoryHandleRef = useRef<VictoryHandle>(null)
  const frontCharacterHandleRef = useRef<CharacterHandle>(null)
  const backCharacterHandleRef = useRef<CharacterHandle>(null)
  const topGameBarHandleRef = useRef<GameBarHandle>(null)
  const bottomGameBarHandleRef = useRef<GameBarHandle>(null)
  const readySetPullHandleRef = useRef<ReadySetPullHandle>(null)
  const rematchRequestHandleRef = useRef<RematchRequestHandle>(null)
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
    await topGameBarHandleRef.current?.reset()
    await bottomGameBarHandleRef.current?.reset()
    await frontCharacterHandleRef.current?.reset()
    await backCharacterHandleRef.current?.reset()
  }, [])

  const playerLeft = useCallback(async () => {
    await frontCharacterHandleRef.current?.updateState({
      characterState: 'left',
    })
  }, [])

  // TODO: EXTRACTED TO CUSTOM HOOK AND USE IN SOLO TOO
  const gameOver = useCallback(async () => {
    const resetGameOver = async () => {
      const hideGameOverPromise = gameOverHandleRef.current?.updateState({
        show: false,
      })
      const showRematchPromsie = rematchRequestHandleRef.current?.updateState({
        show: true,
      })

      await Promise.all([hideGameOverPromise, showRematchPromsie])
    }

    await backCharacterHandleRef.current?.updateState({
      characterState: 'eliminated',
    })
    await frontCharacterHandleRef.current?.updateState({
      characterState: 'winner',
    })

    const soundGen = gameOverHandleRef.current?.runSound()
    await soundGen?.next()
    const hideRematchRequestPromise =
      rematchRequestHandleRef.current?.updateState({
        show: false,
      })
    const showGameOverPromise = gameOverHandleRef.current?.updateState({
      show: true,
      disabled: true,
      on: async (event) => {
        if (event === 'click') {
          resetGameOver()
        }
      },
    })
    await soundGen?.next()
    await gameOverHandleRef.current?.updateState({ disabled: false })
    await wait(1000).promise

    resetGameOver()
  }, [])

  const winGame = useCallback(async () => {
    setIncreaseTime(TIME_WIN_INCREASE_NUMBER)

    const genRunSound = victoryHandleRef.current?.runSound()

    await frontCharacterHandleRef.current?.updateState({
      characterState: 'eliminated',
    })
    await backCharacterHandleRef.current?.updateState({
      characterState: 'winner',
    })
    const hideRematchRequestPromise =
      rematchRequestHandleRef.current?.updateState({
        show: false,
      })
    const showVictoryPromise = victoryHandleRef.current?.updateState({
      show: true,
      type: 'win',
      oldLevel: 722,
      newLevel: 754,
    })
    await Promise.all([hideRematchRequestPromise, showVictoryPromise])
    await genRunSound?.next()
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
    await genRunSound?.next()
    const hideVictoryPromise = victoryHandleRef.current?.updateState({
      show: false,
    })
    const showRematchRequestPromise =
      rematchRequestHandleRef.current?.updateState({
        show: true,
      })
    await Promise.all([hideVictoryPromise, showRematchRequestPromise])

    setIncreaseTime(undefined)
  }, [queryClient, setIncreaseTime])

  const drawGame = useCallback(async () => {
    await frontCharacterHandleRef.current?.reset()
    await backCharacterHandleRef.current?.reset()
    await victoryHandleRef.current?.updateState({ show: true, type: 'draw' })
    await wait(2000).promise

    await victoryHandleRef.current?.updateState({ show: false })
  }, [])

  const pull = async () => {
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

            return
          }
          notify(payload.message, 'info')
          return
        }
        case 'game:reconnected': {
          break
        }
        // TODO: REMOVE round_current
        case 'game:round_started':
        case 'game:round_current': {
          setRound(payload.roundNumber)
          return
        }
        case 'game:ready':
        case 'game:take':
        case 'game:pull': {
          if (payload.roundNumber === 1) {
            await readySetPullHandleRef.current?.start(payload.event)
            if (type === 'game:pull') {
              frontCharacterHandleRef.current?.updateState({ showInfo: false })
              backCharacterHandleRef.current?.updateState({ showInfo: false })
            }
          }

          return
        }
        case 'game:pull_result': {
          notify(payload.message, 'info')

          const isPlayer = playerId === payload.playerId

          const pull = isPlayer ? playerPull : opponentPull

          const gameBarHandleRef = isPlayer
            ? bottomGameBarHandleRef
            : topGameBarHandleRef

          if (payload.fired) {
            await gameBarHandleRef.current?.setActive(payload.index)
          }

          await gameBarHandleRef.current?.highlight(payload.index)

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
        case 'game:started': {
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
          return
        }
        case 'probability': {
          await topGameBarHandleRef.current?.setActive(payload.index)
          await bottomGameBarHandleRef.current?.setActive(payload.index)
          return
        }
        case 'game:rematch_requested': {
          const isPlayer = payload.playerId === playerId

          setRequestIndicator((p) => ({
            ...p,
            [isPlayer ? 'player' : 'opponnent']: {
              confirm: true,
              cancel: undefined,
            } satisfies Indicator,
          }))

          setRematchState('requested')
          notify(payload.message, 'info')
          return
        }
        case 'game:rematch_created': {
          setRequestIndicator({
            player: {
              confirm: true,
              cancel: undefined,
            },
            opponnent: {
              confirm: true,
              cancel: undefined,
            },
          })
          setRematchState('created')
          notify(payload.message, 'info')
          const rematchGameId = payload.rematchGame.id
          navigate(`${ROUTES.duel.play}/${rematchGameId}`, {
            preventScrollReset: true,
          })
          return
        }
        case 'game:rematch_cancelled': {
          const isPlayer = payload.playerId === playerId
          setRequestIndicator((p) => ({
            ...p,
            [isPlayer ? 'player' : 'opponnent']: {
              confirm: undefined,
              cancel: true,
            } satisfies Indicator,
          }))

          return
        }
        case 'game:countdown_update': {
          console.log('game:countdown_update', payload)
          return
        }
        case 'game:player_left': {
          playerLeft()
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
    playerLeft,
  ])

  useEffect(() => {
    duelSocketEvents.connect()
    duelSocketEvents.attachEventListeners()

    return () => {
      duelSocketEvents.dettachEventListeners()

      queueMicrotask(() => {
        if (!isUnmounted()) {
          return
        }

        duelSocketEvents.disconnect()
      })
    }
  }, [duelSocketEvents, isUnmounted])

  return {
    gameOverHandleRef,
    victoryHandleRef,
    frontCharacterHandleRef,
    backCharacterHandleRef,
    topGameBarHandleRef,
    bottomGameBarHandleRef,
    readySetPullHandleRef,
    rematchRequestHandleRef,
    pull,
    requestRematch,
    reset,
    hasPull,
    round,
    requestIndicator,
  }
}
