import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/api/api'
import { ROUTES } from '@/routes/path'
import { DuelSocketEvents } from '@/socket/duel/duel-socket-events'
import { BaseDuelPayload } from '@/socket/duel/duel-socket.types'
import { useGameStore } from '@/store/game.store'
import { notify } from '@/socket/utils'
import { useSettingsStore } from '@/store/settings.store'
import { wait } from '@/lib/utils'
import { TIME_WIN_INCREASE_NUMBER } from '@/lib/constants'
import { CharacterHandle } from '@/components/duel/character'
import { GameBarHandle } from '@/components/duel/duel-game-bar'
import { ReadySetPullHandle } from '@/components/duel/ready-set-pull'
import { VictoryHandle } from '@/components/victory'
import { GameOverHandle } from '@/components/game-over'
import { RematchRequestHandle } from '@/components/rematch-request'

export const useDuelSocket = ({
  gameId,
  playerId,
  duelSocketEvents,
}: {
  gameId: string | null
  playerId: string
  duelSocketEvents: DuelSocketEvents
}) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const setIncreaseTime = useGameStore(({ setIncreaseTime }) => setIncreaseTime)
  const [pulls, setPulls] = useState<number[]>([])
  const [canPull, setCanPull] = useState(true)
  const [round, setRound] = useState(1)
  const gameOverHandleRef = useRef<GameOverHandle>(null)
  const victoryHandleRef = useRef<VictoryHandle>(null)
  const frontCharacterHandleRef = useRef<CharacterHandle>(null)
  const backCharacterHandleRef = useRef<CharacterHandle>(null)
  const topGameBarHandleRef = useRef<GameBarHandle>(null)
  const bottomGameBarHandleRef = useRef<GameBarHandle>(null)
  const readySetPullHandleRef = useRef<ReadySetPullHandle>(null)
  const rematchRequestHandleRef = useRef<RematchRequestHandle>(null)
  const hasPull = !pulls.includes(round)

  const refState = useRef<{
    // TODO: REMOVE
    rematchStatus: 'idle' | 'requested' | 'cancelled' | 'created'
    pullTriggerPromise: Promise<void>
  }>({
    rematchStatus: 'idle',
    pullTriggerPromise: Promise.resolve(),
  })

  const reset = useCallback(async () => {
    await Promise.all([
      gameOverHandleRef.current?.reset(),
      victoryHandleRef.current?.reset(),
      frontCharacterHandleRef.current?.reset(),
      backCharacterHandleRef.current?.reset(),
      topGameBarHandleRef.current?.reset(),
      bottomGameBarHandleRef.current?.reset(),
      rematchRequestHandleRef.current?.reset(),
    ])

    setPulls([])
    setCanPull(true)
    setRound(1)
  }, [])

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
    if (gameId === null || playerId === null) {
      return
    }

    const payload: BaseDuelPayload = {
      gameId,
      playerId,
    }

    duelSocketEvents.requestRematch(payload)
  }

  const cancelRematch = () => {
    nextOpponnet()
  }

  const nextOpponnet = useCallback(() => {
    if (gameId && playerId) {
      duelSocketEvents.leaveDuelGame({ gameId, playerId })
    }
    reset()
    navigate(ROUTES.duel.next, { preventScrollReset: true })
  }, [duelSocketEvents, gameId, navigate, playerId, reset])

  // TODO: EXTRACTED TO CUSTOM HOOK AND USE IN SOLO TOO
  const gameOver = useCallback(async () => {
    await backCharacterHandleRef.current?.updateState({
      characterState: 'eliminated',
    })
    await frontCharacterHandleRef.current?.updateState({
      characterState: 'winner',
    })

    const soundGen = gameOverHandleRef.current?.runSound()
    await soundGen?.next()
    gameOverHandleRef.current?.updateState({
      disabled: true,
    })
    const showGameOverPromise = gameOverHandleRef.current?.show()
    await Promise.all([showGameOverPromise])
    await soundGen?.next()
    await gameOverHandleRef.current?.updateState({ disabled: false })
    await wait(1000).promise

    await gameOverHandleRef.current?.hide()
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
    victoryHandleRef.current?.updateState({
      type: 'win',
      oldLevel: 722,
      newLevel: 754,
    })
    const showVictoryPromise = victoryHandleRef.current?.show()

    await Promise.all([showVictoryPromise])
    await genRunSound?.next()
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
    await genRunSound?.next()

    setIncreaseTime(undefined)
    await victoryHandleRef.current?.hide()
  }, [queryClient, setIncreaseTime])

  const drawGame = useCallback(async () => {
    await frontCharacterHandleRef.current?.reset()
    await backCharacterHandleRef.current?.reset()
    await victoryHandleRef.current?.updateState({ type: 'draw' })
    await victoryHandleRef.current?.show()
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })

    await wait(2000).promise

    await victoryHandleRef.current?.hide()
  }, [queryClient])

  const pull = async () => {
    if (gameId === null || playerId === null) {
      return
    }

    const payload: BaseDuelPayload = {
      gameId,
      playerId,
    }

    setPulls((p) => [...p, round])

    duelSocketEvents.pullTrigger(payload)
  }

  const duelEventsStateRef = useRef({
    round,
    setRound,
  })

  useEffect(() => {
    const setRound = (round: number) => {
      duelEventsStateRef.current.setRound(round)
      duelEventsStateRef.current.round = round
    }

    duelSocketEvents.updateEvents(async (event) => {
      const { type, payload } = event
      const { round } = duelEventsStateRef.current

      switch (type) {
        case 'connect': {
          notify('Connected to duel game service', 'info')
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

            await frontCharacterHandleRef.current?.updateState({
              characterState: isWin ? 'eliminated' : 'winner',
            })
            await backCharacterHandleRef.current?.updateState({
              characterState: !isWin ? 'eliminated' : 'winner',
            })

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
            readySetPullHandleRef.current?.start(payload.event)

            if (type === 'game:ready' || type === 'game:take') {
              setCanPull(false)
            }
            if (type === 'game:pull') {
              setCanPull(true)
              frontCharacterHandleRef.current?.updateState({ showInfo: false })
              backCharacterHandleRef.current?.updateState({ showInfo: false })
            }
          }

          return
        }
        case 'game:pull_result': {
          const pullTrigger = async () => {
            const isUser = playerId === payload.playerId

            const pull = isUser ? playerPull : opponentPull

            const gameBarHandleRef = isUser
              ? bottomGameBarHandleRef
              : topGameBarHandleRef

            if (payload.fired) {
              await topGameBarHandleRef.current?.setActive(payload.index)
              await bottomGameBarHandleRef.current?.setActive(payload.index)
            }

            await gameBarHandleRef.current?.highlight(payload.index)

            await pull(payload.fired)

            if (payload.fired) {
              setCanPull(false)
            }
          }

          refState.current.pullTriggerPromise = pullTrigger()
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
          // TODO: BUG ON SERVER. GAME WITH `REASON` PROPERTY COMES BEFORE PULL TRIGGER
          if (
            payload.reason &&
            !payload.reason?.includes('Maximum rounds reached')
          ) {
            return
          }

          const { canRematch } = payload.rematchInfo

          await refState.current.pullTriggerPromise

          setCanPull(false)
          const isDraw = !payload.winner
          const isWin = payload.winner?.id === playerId

          const result = isDraw ? drawGame : isWin ? winGame : gameOver
          const resultPromise = result()

          if (canRematch) {
            rematchRequestHandleRef.current?.show()
          } else {
            await resultPromise
            nextOpponnet()
            return
          }

          return
        }
        case 'probability': {
          await topGameBarHandleRef.current?.setActive(payload.index)
          await bottomGameBarHandleRef.current?.setActive(payload.index)

          if ((payload.index === 0 && round !== 1) || payload.index === 20) {
            playAudio('bounce')
          }
          return
        }
        case 'game:rematch_requested': {
          refState.current.rematchStatus = 'requested'

          const isUser = payload.userId === playerId
          const userOrOpponent = isUser ? 'user' : 'opponnent'

          await rematchRequestHandleRef.current?.action(
            userOrOpponent,
            'confirm',
          )

          notify(payload.message, 'info')
          return
        }
        case 'game:rematch_created': {
          refState.current.rematchStatus = 'created'
          notify(payload.message, 'info')

          await rematchRequestHandleRef.current?.action('user', 'confirm')
          await rematchRequestHandleRef.current?.action('opponnent', 'confirm')

          await wait(1500).promise

          const rematchGameId = payload.rematchGame.id
          await reset()
          navigate(ROUTES.duel.game(rematchGameId), {
            preventScrollReset: true,
          })
          return
        }
        case 'game:rematch_cancelled': {
          refState.current.rematchStatus = 'cancelled'
          notify(payload.message, 'info')

          const isUser = payload.playerId === playerId
          const userOrOpponent = isUser ? 'user' : 'opponnent'

          await rematchRequestHandleRef.current?.action(
            userOrOpponent,
            'cancel',
          )

          return
        }
        case 'game:countdown_update': {
          console.log('game:countdown_update', payload)
          return
        }
        case 'game:player_left':
        case 'game:player_disconnected': {
          nextOpponnet()
          return
        }
        case 'error': {
          const { event } = payload
          switch (event) {
            case 'game:join':
            case 'game:pull_trigger':
            case 'game:request_rematch':
              if (event === 'game:join') {
                if (
                  payload.message.includes('You are not a participant in game')
                ) {
                  nextOpponnet()
                }
              }
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
    nextOpponnet,
    playAudio,
    reset,
  ])

  useEffect(() => {
    if (!(gameId && playerId)) {
      return
    }

    duelSocketEvents.joinDuelGame({ gameId, playerId })
  }, [duelSocketEvents, gameId, playerId])

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
    cancelRematch,
    reset,
    hasPull,
    canPull,
    round,
  }
}
