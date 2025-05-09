import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/api/api'
import { useBalance } from '@/api/wallet.api'
import { ROUTES } from '@/routes/path'
import { useAfk } from '@/hooks/use-afk'
import { DuelSocketEvents } from '@/socket/duel/duel-socket-events'
import { BaseDuelPayload, Winner } from '@/socket/duel/duel-socket.types'
import { notify } from '@/socket/utils'
import { useSettingsStore } from '@/store/settings.store'
import { wait } from '@/lib/utils'
import { PlayerStatisticsSchema } from '@/lib/schemas/leaderboard.schema'
import { MIN_DUEL_BET } from '@/lib/constants'
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
  const { data: balance } = useBalance()
  const queryClient = useQueryClient()
  const playSound = useSettingsStore(({ playSound }) => playSound)
  const isAfk = useAfk()
  const [pulls, setPulls] = useState<number[]>([])
  const [canPull, setCanPull] = useState(true)
  const [round, setRound] = useState(1)
  const [winner, setWinner] = useState<Winner | null>(null)
  const [gameEnded, setGameEnded] = useState(false)
  const [isLeftOpponent, setIsLeftOpponent] = useState(false)
  const [isDisconnectedOpponent, setIsDisconnectedOpponent] = useState(false)
  const gameOverHandleRef = useRef<GameOverHandle>(null)
  const victoryHandleRef = useRef<VictoryHandle>(null)
  const frontCharacterHandleRef = useRef<CharacterHandle>(null)
  const backCharacterHandleRef = useRef<CharacterHandle>(null)
  const topGameBarHandleRef = useRef<GameBarHandle>(null)
  const bottomGameBarHandleRef = useRef<GameBarHandle>(null)
  const readySetPullHandleRef = useRef<ReadySetPullHandle>(null)
  const rematchRequestHandleRef = useRef<RematchRequestHandle>(null)
  const hasPull = !pulls.includes(round)

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
    setRound((duelEventsStateRef.current.round = 1))
    setWinner((duelEventsStateRef.current.winner = null))
    setGameEnded((duelEventsStateRef.current.gameEnded = false))
    setIsLeftOpponent((duelEventsStateRef.current.isLeftOpponent = false))
    setIsDisconnectedOpponent(
      (duelEventsStateRef.current.isDisconnectedOpponent = false),
    )
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
    leaveGame()
  }

  const leaveGame = useCallback(
    async (hasNext = true) => {
      await duelEventsStateRef.current.resultPromise

      reset()
      const canNext = hasNext && duelEventsStateRef.current.canNext()
      navigate(canNext ? ROUTES.duel.next : ROUTES.duel.enterArena, {
        preventScrollReset: true,
      })
    },
    [navigate, reset],
  )

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
    const getLvl = () =>
      (
        queryClient.getQueryData([
          QUERY_KEYS.playerStatistics,
          playerId,
        ]) as PlayerStatisticsSchema
      ).lvl

    const playerStatisticsQueryPromise = queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.playerStatistics, playerId],
    })

    const genRunSound = victoryHandleRef.current?.runSound()

    await frontCharacterHandleRef.current?.updateState({
      characterState: 'eliminated',
    })
    await backCharacterHandleRef.current?.updateState({
      characterState: 'winner',
    })

    const oldLvl = getLvl()
    await playerStatisticsQueryPromise
    const newLvl = getLvl()

    victoryHandleRef.current?.updateState({
      type: 'win',
      oldLevel: oldLvl,
      newLevel: newLvl,
    })
    const showVictoryPromise = victoryHandleRef.current?.show()

    await Promise.all([showVictoryPromise])
    await genRunSound?.next()
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
    await genRunSound?.next()

    await victoryHandleRef.current?.hide()
  }, [playerId, queryClient])

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
    winner,
    setWinner,
    pullTriggerPromise: Promise.resolve(),
    resultPromise: Promise.resolve(),
    balance,
    canNext: (): boolean => {
      const balance = duelEventsStateRef.current.balance
      return Boolean(!(balance < MIN_DUEL_BET) && !isAfk())
    },
    isLeftOpponent,
    setIsLeftOpponent,
    isDisconnectedOpponent,
    setIsDisconnectedOpponent,
    gameEnded,
    setGameEnded,
  })

  useEffect(() => {
    duelEventsStateRef.current.balance = balance
  }, [balance])

  useEffect(() => {
    const setRound = (round: number) => {
      duelEventsStateRef.current.setRound(round)
      duelEventsStateRef.current.round = round
    }

    const setWinner = (winner: Winner | null) => {
      duelEventsStateRef.current.setWinner(winner)
      duelEventsStateRef.current.winner = winner
    }

    const setGameEnded = (eneded: boolean) => {
      duelEventsStateRef.current.setGameEnded(eneded)
      duelEventsStateRef.current.gameEnded = eneded
    }

    const setIsLeftOpponent = (isLeftOpponent: boolean) => {
      duelEventsStateRef.current.setIsLeftOpponent(isLeftOpponent)
      duelEventsStateRef.current.isLeftOpponent = isLeftOpponent
    }

    const setIsDisconnectedOpponent = (isDisconnectedOpponent: boolean) => {
      duelEventsStateRef.current.setIsDisconnectedOpponent(
        isDisconnectedOpponent,
      )
      duelEventsStateRef.current.isDisconnectedOpponent = isDisconnectedOpponent
    }

    duelSocketEvents.updateEvents(async (event) => {
      if (
        event.payload &&
        'gameId' in event.payload &&
        event.payload.gameId !== gameId
      ) {
        return
      }

      const { type, payload } = event

      const {
        round,
        winner,
        isDisconnectedOpponent,
        isLeftOpponent,
        gameEnded,
      } = duelEventsStateRef.current

      switch (type) {
        case 'connect': {
          notify('Connected to duel game service', 'info')
          return
        }
        case 'connect_error': {
          break
        }
        case 'disconnect': {
          notify(`Disconnected from duel game service`, 'info')
          return
        }
        case 'game:joined': {
          const { game } = payload
          if (payload.game.status === 'completed') {
            setRound(game.currentRound)
            setCanPull(false)

            const losePlayer = game.players.find(
              (p) => p.status === 'eliminated',
            )

            const isLose = losePlayer && losePlayer.userId === playerId

            if (losePlayer) {
              await frontCharacterHandleRef.current?.updateState({
                characterState: !isLose ? 'eliminated' : 'winner',
              })
              await backCharacterHandleRef.current?.updateState({
                characterState: isLose ? 'eliminated' : 'winner',
              })
              return
            }

            await victoryHandleRef.current?.updateState({ type: 'draw' })
            await victoryHandleRef.current?.show()

            return
          }
          await queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.balance],
          })
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

            const highlightPromise = gameBarHandleRef.current?.highlight(
              payload.index,
            )
            const pullPromise = pull(payload.fired)

            await Promise.all([highlightPromise, pullPromise])

            if (payload.fired) {
              setCanPull(false)
            }
          }

          duelEventsStateRef.current.pullTriggerPromise = pullTrigger()
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
          if (payload.reason?.includes('Player eliminated in duel')) {
            return
          }

          if (winner) {
            return
          }

          const { winner: gameWinner = null } = payload
          const { rematchScores, canRematch } = payload.rematchInfo

          setWinner(gameWinner)
          setGameEnded(true)
          setCanPull(false)

          await duelEventsStateRef.current.pullTriggerPromise

          const isDraw = !gameWinner
          const isWin = gameWinner?.id === playerId

          const result = isDraw ? drawGame : isWin ? winGame : gameOver
          duelEventsStateRef.current.resultPromise = result()

          const [scorePlayer1 = 0, scorePlayer2 = 0] =
            Object.values(rematchScores)

          const diffScore = Math.abs(scorePlayer1 - scorePlayer2)

          const hasWinnerRematch = diffScore < 2
          const hasNext = !isDraw
          const canNext = duelEventsStateRef.current.canNext()
          const opponnentPresent = !isLeftOpponent && !isDisconnectedOpponent

          if (
            canRematch &&
            hasWinnerRematch &&
            hasNext &&
            canNext &&
            opponnentPresent
          ) {
            rematchRequestHandleRef.current?.show()
            return
          }

          leaveGame(hasNext)

          return
        }
        case 'probability': {
          await topGameBarHandleRef.current?.setActive(payload.index)
          await bottomGameBarHandleRef.current?.setActive(payload.index)

          if ((payload.index === 0 && round !== 1) || payload.index === 20) {
            playSound('bounce')
          }
          return
        }
        case 'game:rematch_requested': {
          notify(payload.message, 'info')

          const isUser = payload.userId === playerId
          const userOrOpponent = isUser ? 'user' : 'opponnent'

          await rematchRequestHandleRef.current?.action(
            userOrOpponent,
            'confirm',
          )

          return
        }
        case 'game:rematch_created': {
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
          notify(payload.message, 'info')

          console.log('game:rematch_cancelled')

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
        case 'game:player_left': {
          const isUser = payload.leavingUserId === playerId
          const isOpponent = !isUser

          if (isOpponent) {
            setIsLeftOpponent(true)

            if (gameEnded) {
              leaveGame()
            }
          }
          return
        }
        case 'game:player_disconnected': {
          const isUser = payload.disconnectedPlayerId === playerId
          const isOpponent = !isUser

          if (isOpponent) {
            setIsDisconnectedOpponent(true)

            if (gameEnded) {
              leaveGame()
            }
          }
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
                  leaveGame()
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
    gameId,
    winGame,
    gameOver,
    playerPull,
    opponentPull,
    drawGame,
    navigate,
    leaveGame,
    playSound,
    reset,
    queryClient,
    isAfk,
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
