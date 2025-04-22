import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/api/api'
import {
  Offer,
  useAcceptOffer,
  useAllGames,
  useGameDetails,
  usePullGame,
  useStartGame,
} from '@/api/game.api'
import { useBalance } from '@/api/wallet.api'
import { useGameSocket } from '@/socket/game/use-game-socket'
import { ROUTES } from '@/routes/path'
import { useSettingsStore } from '@/store/settings.store'
import { useGameStore } from '@/store/game.store'
import { useWait } from '@/hooks/use-wait'
import { useUnmountedState } from '@/hooks/use-unmount-state'
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
import { FooterHandle } from '@/components/solo/footer-solo'

const useSolo = (variant: VariantGame) => {
  const navigate = useNavigate()
  const { gameId } = useParams<{ gameId: string }>()
  const { data: balance } = useBalance()
  const queryClient = useQueryClient()
  const wait = useWait()
  const isUnmounted = useUnmountedState()
  const footerHandleRef = useRef<FooterHandle>(null)
  const gameOverHandleRef = useRef<GameOverHandle>(null)
  const victoryHandleRef = useRef<VictoryHandle>(null)
  const revolverHandleRef = useRef<RevolverHandle>(null)
  const setIncreaseTime = useGameStore(({ setIncreaseTime }) => setIncreaseTime)
  const { data: gameDetails } = useGameDetails(variant === 'play')
  const { mutateAsync: acceptOfferMutation } = useAcceptOffer()
  const { mutateAsync: startGameMutation } = useStartGame()
  const { data: allGames = [] } = useAllGames()
  const { mutateAsync: gamePullMutation } = usePullGame()
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const [countBullet, setCountBullet] = useState(5)
  const [bet, setBet] = useState(0)
  const [jackpot, setJackpot] = useState(-1)
  const [offer, setOffer] = useState<Offer | null>(null)
  // TODO: ADD REF HANDLE FOR NOT RE RENDER COMPONENT
  const [multiplier, setMultiplier] = useState(-1)
  const [startedMultiplierSpin, setStartedMultiplierSpin] = useState(false)
  const isStartedGame = Boolean(gameId)
  const noMoney = !isStartedGame && !(balance > 0 || bet > 0)
  const maxBet = Math.min(isStartedGame ? bet + balance : balance, MAX_BET)
  const [showHelpers, setShowHelpers] = useState(true)
  const isPlay = variant === 'play'

  const newGame = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.allGames] })
    await queryClient.setQueryData([QUERY_KEYS.gameDetails], null)

    if (gameId && !isUnmounted()) {
      navigate(ROUTES.solo[variant], {
        preventScrollReset: true,
      })
    }

    victoryHandleRef.current?.hide()
    gameOverHandleRef.current?.hide()

    const hasPrevBet = bet !== 0
    const prevBet = hasPrevBet ? (bet > balance ? balance : bet) : 0

    setJackpot(-1)
    setBet(prevBet)
    setOffer(null)
    setCountBullet(5)
    setMultiplier(-1)
  }, [queryClient, gameId, isUnmounted, bet, balance, navigate, variant])

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
      navigate(ROUTES.solo.game(gameId), { preventScrollReset: true })

      const multiplierIndex = MULTIPLIERS.findIndex(
        (value) => value === Number(multiplier),
      )

      if (multiplierIndex !== -1) {
        setStartedMultiplierSpin(true)
        await getMultiplier(multiplierIndex)
        setStartedMultiplierSpin(false)
      }
    },
    [bet, getMultiplier, navigate, queryClient, startGameMutation],
  )

  const gameOver = useCallback(async () => {
    const soundGen = gameOverHandleRef.current?.runSound()
    await soundGen?.next()
    await gameOverHandleRef.current?.updateState({
      show: true,
      disabled: true,
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
      const { success, position, offer } =
        result ?? (await gamePullMutation(gameId))

      const isGameOver = !success
      const isWin = !isGameOver && position === 5

      await revolverHandleRef.current?.trigger()
      await revolverHandleRef.current?.spin()
      await revolverHandleRef.current?.click()

      setCountBullet(5 - position)
      setOffer(offer ?? null)

      if (isGameOver) {
        await revolverHandleRef.current?.shot()
        await gameOver()
        return
      }
      if (isWin) {
        await winGame()
        return
      }
    },
    [gamePullMutation, setCountBullet, setOffer, gameOver, winGame],
  )

  const pull = useCallback(async () => {
    if (!gameId && bet === 0) {
      footerHandleRef.current?.wiggleWager()
      return
    }

    if (!gameId) {
      setShowHelpers(false)
      await startGame()
      return
    }

    await pullGame(gameId)
  }, [bet, gameId, pullGame, startGame])

  useEffect(() => {
    if (isStartedGame) {
      return
    }

    const activeGame = allGames.find((game) => game.status === 'ACTIVE')

    if (activeGame) {
      navigate(ROUTES.solo.game(activeGame.id), { preventScrollReset: true })
    }
  }, [allGames, navigate, isStartedGame])

  useEffect(() => {
    if (startedMultiplierSpin) {
      return
    }

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
    gameOver,
    winGame,
    isStartedGame,
    startedMultiplierSpin,
  ])

  const { watchGame, watchingLargestGame } = useGameSocket(isPlay, pullGame)

  // Update state from watched game if available (for watch mode)
  useEffect(() => {
    if (startedMultiplierSpin) {
      return
    }

    if (isPlay || !watchGame?.game || !isStartedGame) {
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
  }, [
    watchGame,
    isPlay,
    isStartedGame,
    gameOver,
    winGame,
    startedMultiplierSpin,
  ])

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
    pull,
    deal,
    watchGame,
    watchingLargestGame,
    newGame,
  }
}

export { useSolo }
