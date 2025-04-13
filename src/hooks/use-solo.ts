import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

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
import { useGameSocket } from '@/socket/game/use-game-socket'
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
import { FooterHandle } from '@/components/footer-solo'

const useSolo = (variant: VariantGame) => {
  const navigate = useNavigate()
  const { gameId } = useParams<{ gameId: string }>()
  const { data: balance } = useBalance()
  const queryClient = useQueryClient()
  const wait = useWait()
  const footerHandleRef = useRef<FooterHandle>(null)
  const gameOverHandleRef = useRef<GameOverHandle>(null)
  const victoryHandleRef = useRef<VictoryHandle>(null)
  const revolverHandleRef = useRef<RevolverHandle>(null)
  const setIncreaseTime = useGameStore(({ setIncreaseTime }) => setIncreaseTime)
  const { data: gameDetails } = useGameDetails(variant === 'play')
  const { mutateAsync: acceptOfferMutation } = useAcceptOffer()
  const { mutateAsync: startGameMutation } = useStartGame()
  const { data: allGames = [] } = useAllGames()
  const { mutateAsync: gamePullMutation } = useGamePull()
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const declineAllDeals = useSettingsStore(
    ({ declineAllDeals }) => declineAllDeals,
  )
  const [countBullet, setCountBullet] = useState(5)
  const [bet, setBet] = useState(0)
  const [jackpot, setJackpot] = useState(-1)
  const [offer, setOffer] = useState<Offer | null>(null)
  const [multiplier, setMultiplier] = useState(-1)
  const [isStartedGame, setIsStartedGame] = useState(Boolean(gameId))
  const noMoney = !isStartedGame && !(balance > 0 || bet > 0)
  const maxBet = Math.min(isStartedGame ? bet + balance : balance, MAX_BET)
  const [showHelpers, setShowHelpers] = useState(true)
  const isPlay = variant === 'play'

  const newGame = useCallback(async () => {
    await victoryHandleRef.current?.updateState({ show: false })
    await gameOverHandleRef.current?.updateState({ show: false })

    if (gameId) {
      navigate(ROUTES.solo[variant], {
        preventScrollReset: true,
      })
    }

    await queryClient.setQueryData([QUERY_KEYS.gameDetails], null)

    const hasPrevBet = bet !== 0
    const prevBet = hasPrevBet ? (bet > balance ? balance : bet) : 0

    setJackpot(-1)
    setBet(prevBet)
    setOffer(null)
    setCountBullet(5)
    setMultiplier(-1)
  }, [gameId, queryClient, bet, balance, navigate, variant])

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
      setIsStartedGame(true)
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
      navigate(`${ROUTES.solo.root}/${gameId}`, { preventScrollReset: true })
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
    if (!gameId && bet === 0) {
      footerHandleRef.current?.wiggleWager()
      return
    }

    if (!gameId) {
      await startGame()
      return
    }

    await pullGame(gameId)
  }, [bet, gameId, pullGame, startGame])

  useEffect(() => {
    const activeGame = allGames.find((game) => game.status === 'ACTIVE')
    if (activeGame && !gameId) {
      // navigate(`${ROUTES.solo.root}/${activeGame.id}`, { preventScrollReset: true })
    }
  }, [allGames, navigate, gameId])

  useEffect(() => {
    if (!isStartedGame) {
      return
    }

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
    gameId,
    gameOver,
    winGame,
    isStartedGame,
  ])

  useEffect(() => {
    setIsStartedGame(Boolean(gameId))
  }, [gameId])

  const { watchGame } = useGameSocket(isPlay, pullGame)

  // Update state from watched game if available (for watch mode)
  useEffect(() => {
    if (isPlay || !watchGame?.game || !gameId) {
      return
    }

    const game = watchGame.game
    
    setJackpot(Number(game.potentialWin))
    setBet(Number(game.betAmount))
    setCountBullet(5 - game.currentPosition)
    setMultiplier(game.multiplier)
    
    if (game.currentOffer) {
      setOffer(game.currentOffer)
    }
    
    const isGameOver = game.status === 'COMPLETED_LOSE'
    const isWin = game.status === 'COMPLETED_WIN'
    
    if (isGameOver) gameOver()
    if (isWin) winGame()
  }, [watchGame, isPlay, gameId, gameOver, winGame])

  return {
    footerHandleRef,
    gameOverHandleRef,
    victoryHandleRef,
    revolverHandleRef,
    offer,
    bet,
    jackpot,
    isStartedGame,
    multiplier,
    countBullet,
    noMoney,
    maxBet,
    showHelpers,
    setShowHelpers,
    setBet,
    next,
    deal,
    watchGame,
  }
}

export { useSolo }
