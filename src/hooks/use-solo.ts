import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { socketGame } from '@/socket/socket'
import { QUERY_KEYS } from '@/api/api'
import {
  Offer,
  useAcceptOffer,
  useAllGames,
  useGameDetails,
  useGamePull,
  useStartGame,
} from '@/api/game.api'
import { useBalance } from '@/api/wallet.api'
import { ROUTES } from '@/routes/path'
import { useSettingsStore } from '@/store/settings.store'
import { useGameStore } from '@/store/game.store'
import { useWait } from '@/hooks/use-wait'
import { randomIntFromInterval } from '@/lib/utils'
import {
  MAX_BET,
  MULTIPLIERS,
  TIME_WIN_INCREASE_NUMBER,
  VariantGame,
} from '@/lib/constants'
import { RevolverHandle } from '@/components/guns/revolver'
import { VictoryHandle } from '@/components/victory'
import { GameOverHandle } from '@/components/game-over'

// TODO: SPLIT DUEL AND SOLO
const useSolo = (variant: VariantGame) => {
  const navigate = useNavigate()
  const { gameId } = useParams<{ gameId: string }>()
  const queryClient = useQueryClient()
  const gameOverHandleRef = useRef<GameOverHandle>(null)
  const victoryHandleRef = useRef<VictoryHandle>(null)
  const revolverHandleRef = useRef<RevolverHandle>(null)
  const disabledRef = useRef(false)
  const setIncreaseTime = useGameStore(({ setIncreaseTime }) => setIncreaseTime)
  const { data: gameDetails } = useGameDetails(variant === 'play')
  const { mutateAsync: acceptOfferMutation } = useAcceptOffer()
  const { mutateAsync: startGameMutation } = useStartGame()
  const { data: allGames = [] } = useAllGames()
  const { mutateAsync: gamePullMutation } = useGamePull()
  const { data: balance } = useBalance()
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const declineAllDeals = useSettingsStore(
    ({ declineAllDeals }) => declineAllDeals,
  )
  const setCountBullet = useGameStore(({ setCountBullet }) => setCountBullet)
  const setOffer = useGameStore(({ setOffer }) => setOffer)
  const setBet = useGameStore(({ setBet }) => setBet)
  const setMultiplier = useGameStore(({ setMultiplier }) => setMultiplier)
  const setIsStartedGame = useGameStore(
    ({ setIsStartedGame }) => setIsStartedGame,
  )
  const setJackpot = useGameStore(({ setJackpot }) => setJackpot)
  const setMaxBet = useGameStore(({ setMaxBet }) => setMaxBet)
  const restartGame = useGameStore(({ newGame }) => newGame)
  const isStartedGame = useGameStore(({ isStartedGame }) => isStartedGame)
  const offer = useGameStore(({ offer }) => offer)
  const bet = useGameStore(({ bet }) => bet)
  const jackpot = useGameStore(({ jackpot }) => jackpot)
  const wait = useWait()
  const isPlay = variant === 'play'
  const [watchGame, setWatchGame] = useState<{
    gameId: string
    jackpot: number
  } | null>(null)

  const newGame = useCallback(async () => {
    await victoryHandleRef.current?.updateState({ show: false })
    await gameOverHandleRef.current?.updateState({ show: false })

    if (gameId) {
      navigate(ROUTES.solo[variant], {
        preventScrollReset: true,
      })
    }

    await queryClient.setQueryData([QUERY_KEYS.gameDetails], null)

    restartGame()
  }, [restartGame, navigate, queryClient, gameId, variant])

  const getMultiplier = useCallback(
    async (multiplierIndex: number): Promise<void> => {
      const revolverHandle = revolverHandleRef.current

      if (revolverHandle === null) {
        return
      }

      const length = MULTIPLIERS.length
      const AMOUNT_CHAMBER =
        length * Math.round(randomIntFromInterval(20, 30) / length) +
        multiplierIndex

      const spinAudio = await playAudio('spin')

      const END_DELAY = 100
      const DURATION_AUDIO = spinAudio.duration * 1000 - END_DELAY
      const interval = DURATION_AUDIO / AMOUNT_CHAMBER

      const FINISH_INDEX = AMOUNT_CHAMBER
      let currentIndex = 0

      return new Promise<void>((resolve) => {
        const spin = async (prevLag: number) => {
          const startSpin = Date.now()
          const correctLag = prevLag % interval
          const amountMissSpin = Math.floor(Math.abs(prevLag) / interval)

          currentIndex += amountMissSpin

          await revolverHandle.spin(interval + correctLag)

          const realInterval = Date.now() - (startSpin + correctLag)

          const lag = interval - realInterval
          const newIndex =
            Math.min(currentIndex++, FINISH_INDEX) % MULTIPLIERS.length
          const multiplier = MULTIPLIERS[newIndex]

          setMultiplier(multiplier)
          setJackpot(bet * multiplier)

          if (currentIndex > FINISH_INDEX) {
            return
          }

          return spin(lag)
        }

        spin(0).then(resolve)
      })
    },
    [bet, playAudio, setJackpot, setMultiplier],
  )

  const deal = async () => {
    if (offer) {
      await acceptOfferMutation(offer.id)
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
      await playAudio('chaching')
      await newGame()
    }
  }

  const startGame = useCallback(
    async (result?: { gameId: string; multiplier: string }) => {
      const { gameId, multiplier } =
        result ??
        (await startGameMutation({
          betAmount: String(bet),
        }))
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })

      const multiplierIndex = MULTIPLIERS.findIndex(
        (value) => value === Number(multiplier),
      )

      if (multiplierIndex === -1) {
        return
      }

      await getMultiplier(multiplierIndex)
      navigate(`${ROUTES.solo.play}/${gameId}`, { preventScrollReset: true })
    },
    [bet, getMultiplier, navigate, queryClient, startGameMutation],
  )

  const gameOver = useCallback(async () => {
    const soundGen = gameOverHandleRef.current?.runSound()
    await soundGen?.next()
    await gameOverHandleRef.current?.updateState({
      show: true,
      disabled: true,
      on: async (event) => {
        if (event === 'click') {
          newGame()
        }
      },
    })
    await soundGen?.next()
    await gameOverHandleRef.current?.updateState({ disabled: false })
    await wait(1000)
    newGame()
  }, [wait, newGame])

  const winGame = useCallback(async () => {
    setIncreaseTime(TIME_WIN_INCREASE_NUMBER)

    const genRunSound = victoryHandleRef.current?.runSound()

    await victoryHandleRef.current?.updateState({
      show: true,
      type: 'win',
      win: jackpot,
    })
    await genRunSound?.next()
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
    await genRunSound?.next()

    setIncreaseTime(undefined)
    newGame()
  }, [setIncreaseTime, queryClient, jackpot, newGame])

  const pullGame = useCallback(
    async (
      gameId: string,
      result?: { success: boolean; position: number; offer: Offer | null },
    ) => {
      const revolverHandle = revolverHandleRef.current

      if (revolverHandle === null) {
        return
      }

      const { success, position, offer } =
        result ?? (await gamePullMutation(gameId))

      const isGameOver = !success
      const isWin = !isGameOver && position === 5

      setCountBullet(5 - position)

      await revolverHandle.trigger()
      await revolverHandle.spin()
      await revolverHandle.click()

      if (isGameOver) {
        await revolverHandle.shot()
        await gameOver()
        return
      }
      if (isWin) {
        await winGame()
        return
      }
      if (offer && !declineAllDeals) {
        setOffer(offer)
      }
    },
    [
      declineAllDeals,
      gamePullMutation,
      setCountBullet,
      setOffer,
      gameOver,
      winGame,
    ],
  )

  const next = useCallback(async () => {
    if (disabledRef.current) {
      return
    }

    try {
      disabledRef.current = true

      if (!gameId) {
        await startGame()
        return
      }

      await pullGame(gameId)
    } catch (e) {
      console.log(e)
    } finally {
      disabledRef.current = false
    }
  }, [gameId, pullGame, startGame])

  useEffect(() => {
    const activeGame = allGames.find((game) => game.status === 'ACTIVE')
    if (activeGame && !gameId) {
      // navigate(`${ROUTES.solo.play}/${activeGame.id}`, { preventScrollReset: true })
    }
  }, [allGames, navigate, gameId])

  useEffect(() => {
    const maxBet = Math.min(isStartedGame ? bet + balance : balance, MAX_BET)
    setMaxBet(maxBet)
  }, [isStartedGame, balance, bet, gameId, setMaxBet])

  useEffect(() => {
    if (!gameDetails) {
      return
    }

    const jackpot = Number(gameDetails.potentialWin ?? 0)
    const bet = Number(gameDetails.betAmount ?? 0)
    const multiplier = Number(gameDetails.multiplier ?? 0)
    const countBullet = 5 - Number(gameDetails.currentPosition ?? 0)
    const isGameOver = gameDetails.status === 'COMPLETED_LOSE'
    const isWin = gameDetails.status === 'COMPLETED_WIN'

    setJackpot(jackpot)
    setBet(bet)
    setCountBullet(countBullet)
    setMultiplier(multiplier)
    if (isGameOver) gameOver()
    if (isWin) winGame()
  }, [
    gameDetails,
    setJackpot,
    setBet,
    setCountBullet,
    setMultiplier,
    setIsStartedGame,
    gameId,
    gameOver,
    winGame,
  ])

  useEffect(() => {
    setIsStartedGame(Boolean(gameId))

    if (gameId) {
      return
    }

    // TODO: REMOVE
    variant === 'play' && newGame()
  }, [gameId, newGame, setIsStartedGame, variant])

  useEffect(() => {
    if (isPlay || !gameId) {
      return
    }
    let isUnmounted = false

    setWatchGame(null)

    socketGame.emit('watch_game', gameId, (response: unknown) => {
      console.log('watch_game', response) // ok

      if (isUnmounted) {
        socketGame.emit('unwatch_game', gameId, (response: unknown) => {
          console.log('unwatch_game', response) // ok
        })
      }
    })

    const pullResult = (response: unknown) => {
      console.log('pull_result', response)
      pullGame(
        gameId,
        response as { success: boolean; position: number; offer: Offer | null },
      )
    }
    // const gameUpdate = (response: unknown) => {
    //   // console.log('game_update', response)
    // }
    // const offer_created = (response: unknown) => {
    //   // console.log('offer_created', response)
    // }
    // const offer_accepted = (response: unknown) => {
    //   // console.log('offer_accepted', response)
    // }
    // const offer_rejected = (response: unknown) => {
    //   // console.log('offer_rejected', response)
    // }
    // const next_largest_game = (response: unknown) => {
    //   console.log('next_largest_game', response)
    // }

    socketGame.on('pull_result', pullResult)
    // socket.on('game_update', gameUpdate)
    // socket.on('offer_created', offer_created)
    // socket.on('offer_accepted', offer_accepted)
    // socket.on('offer_rejected', offer_rejected)
    // socket.on('next_largest_game', next_largest_game)

    return () => {
      isUnmounted = true
      socketGame.emit('unwatch_game', gameId, (response: unknown) => {
        console.log('unwatch_game', response) // ok
      })

      socketGame.off('pull_result', pullResult)
      // socket.off('game_update', gameUpdate)
      // socket.off('offer_created', offer_created)
      // socket.off('offer_accepted', offer_accepted)
      // socket.off('offer_rejected', offer_rejected)
      // socket.off('next_largest_game', next_largest_game)
    }
  }, [isPlay, gameId, pullGame])

  useEffect(() => {
    if (gameId || variant === 'play') {
      return
    }
    let id: number | null = null
    let isUnmounted = false
    const call = () => {
      socketGame.emit(
        'watch_largest_prize',
        (response: { gameId: string; potentialWin: string }) => {
          if (isUnmounted) {
            return
          }

          setWatchGame({
            gameId: String(response.gameId),
            jackpot: Number(response.potentialWin!),
          })
        },
      )
      id = window.setTimeout(call, 1000)
    }
    call()
    return () => {
      isUnmounted = true
      if (id) {
        clearTimeout(id)
      }
    }
  }, [variant, gameId])

  return {
    gameOverHandleRef,
    victoryHandleRef,
    revolverHandleRef,
    next,
    deal,
    watchGame,
  }
}

export { useSolo }
