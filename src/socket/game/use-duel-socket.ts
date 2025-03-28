import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/routes/path'

import { socketDuel as socket } from '@/socket/socket'
import { DuelSocketEvents } from '@/socket/game/duel-socket-events'
import { useInUnmounted } from '@/hooks/use-is-unmounted'
import { useSettingsStore } from '@/store/settings.store'
import { notify } from '@/socket/utils'
import { wait, waitEndAudio } from '@/lib/utils'
import { CharacterHandle, CharacterState } from '@/components/character'
import { GameBarHandle } from '@/components/duel-game-bar'
import { ReadySetPullHandle } from '@/components/ready-set-pull'

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
  const isUnmounted = useInUnmounted()
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

  const duelEvents = useMemo(
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
    await backCharacterHandleRef?.current?.setState('eliminated')
    await frontCharacterHandleRef?.current?.setState('winner')
    setGameState('lose')
  }, [])

  const winGame = useCallback(
    async (characterState: CharacterState = 'eliminated') => {
      await frontCharacterHandleRef?.current?.setState(characterState)
      await backCharacterHandleRef?.current?.setState('winner')
      setGameState('win')

      const winSoundAudio = await playAudio('winsound', false)
      const chachingAudio = await playAudio('chaching', false)

      const startAudio = await new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(false), 100)
        chachingAudio.addEventListener('play', () => resolve(true))
      })

      startAudio && (await waitEndAudio(chachingAudio))
      startAudio && (await waitEndAudio(winSoundAudio))
      !startAudio && (await wait(2000))

      newGame()
    },
    [playAudio, newGame],
  )

  const drawGame = useCallback(() => {
    setGameState('draw')
  }, [])

  const pullTrigger = async () => {
    setPulls((p) => [...p, round])

    duelEvents.pullTrigger()
  }

  useEffect(() => {
    duelEvents.updateEvents(async (event) => {
      const { type, payload } = event
      switch (type) {
        case 'connect': {
          notify('Connected to duel game service', 'info')
          duelEvents.joinDuelGame()
          return
        }
        case 'connect_error': {
          break
        }
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

          if (isPlayer) {
            await gameBarRefHandle.current?.setActive(payload.index)
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
    duelEvents,
    playerId,
    winGame,
    gameOver,
    playerPull,
    opponentPull,
    drawGame,
    navigate,
  ])

  useEffect(() => {
    duelEvents.connect()
    duelEvents.attachEventListeners()

    return () => {
      duelEvents.dettachEventListeners()
      queueMicrotask(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (!isUnmounted.current) {
          return
        }
        duelEvents.disconnect()
      })
    }
  }, [duelEvents, isUnmounted])

  return {
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
