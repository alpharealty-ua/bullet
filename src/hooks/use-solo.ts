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
import { type FetchBalanceResponse, useBalance } from '@/api/wallet.api'
import { ROUTES } from '@/routes/path'
import { useSettingsStore } from '@/store/settings.store'
import { useSoloStore } from '@/store/solo.store'
import { useWait } from '@/hooks/use-wait'
import { useUnmountedState } from '@/hooks/use-unmount-state'
import { randomIntFromInterval } from '@/lib/utils'
import { MAX_BET, MULTIPLIERS, VariantGame } from '@/lib/constants'
import { RevolverHandle } from '@/components/guns/revolver'
import { VictoryHandle } from '@/components/victory'
import { GameOverHandle } from '@/components/game-over'
import { FooterHandle } from '@/components/solo/footer-solo'
import { ResultHandle } from '@/components/solo/result'

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
  const jackpotHandleRef = useRef<ResultHandle>(null)
  const multiplierHandleRef = useRef<ResultHandle>(null)
  const { data: gameDetails } = useGameDetails(variant === 'play')
  const { mutateAsync: acceptOfferMutation } = useAcceptOffer()
  const { mutateAsync: startGameMutation } = useStartGame()
  const { data: allGames = [] } = useAllGames()
  const { mutateAsync: gamePullMutation } = usePullGame()
  const playSound = useSettingsStore(({ playSound }) => playSound)
  const setCountBullet = useSoloStore(({ setCountBullet }) => setCountBullet)
  const setBet = useSoloStore(({ setBet }) => setBet)
  const setJackpot = useSoloStore(({ setJackpot }) => setJackpot)
  const setMultiplier = useSoloStore(({ setMultiplier }) => setMultiplier)
  const setOffer = useSoloStore(({ setOffer }) => setOffer)
  const countBullet = useSoloStore(({ countBullet }) => countBullet)
  const bet = useSoloStore(({ bet }) => bet)
  const jackpot = useSoloStore(({ jackpot }) => jackpot)
  const multiplier = useSoloStore(({ multiplier }) => multiplier)
  const offer = useSoloStore(({ offer }) => offer)
  const isStartedGame = Boolean(gameId)
  const noMoney = !isStartedGame && !(balance > 0 || bet > 0)
  const maxBet = Math.floor(
    Math.min(isStartedGame ? bet + balance : balance, MAX_BET),
  )
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

    const balance = (
      (await queryClient.getQueryData([
        QUERY_KEYS.balance,
      ])) as FetchBalanceResponse
    ).balance.formattedAmount

    victoryHandleRef.current?.hide()
    gameOverHandleRef.current?.hide()

    const hasPrevBet = bet !== 0
    const prevBet = hasPrevBet ? (bet > balance ? balance : bet) : 0

    setCountBullet(5)
    setBet(prevBet)
    setJackpot(-1)
    setMultiplier(-1)
    setOffer(null)
  }, [
    queryClient,
    gameId,
    isUnmounted,
    bet,
    setJackpot,
    setBet,
    setOffer,
    setCountBullet,
    setMultiplier,
    navigate,
    variant,
  ])

  const getMultiplier = useCallback(
    async (multiplierIndex: number): Promise<void> => {
      const bet = useSoloStore.getState().bet

      const length = MULTIPLIERS.length
      const AMOUNT_CHAMBER =
        length * Math.round(randomIntFromInterval(20, 30) / length) +
        multiplierIndex

      const spinAudio = await playSound('spin')

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

          await revolverHandleRef.current?.spin(interval + correctLag)

          const realInterval = Date.now() - (startSpin + correctLag)

          const lag = interval - realInterval
          const newIndex =
            Math.min(currentIndex++, FINISH_INDEX) % MULTIPLIERS.length
          const multiplier = MULTIPLIERS[newIndex]

          jackpotHandleRef.current?.updateState({
            value: `$${bet * multiplier}`,
          })
          multiplierHandleRef.current?.updateState({ value: `${multiplier}x` })

          if (currentIndex > FINISH_INDEX) {
            setJackpot(bet * multiplier)
            setMultiplier(multiplier)
            jackpotHandleRef.current?.updateState({ activeRef: false })
            multiplierHandleRef.current?.updateState({ activeRef: false })
            return
          }

          return spin(lag)
        }

        jackpotHandleRef.current?.show()
        multiplierHandleRef.current?.show()
        jackpotHandleRef.current?.updateState({ activeRef: true })
        multiplierHandleRef.current?.updateState({ activeRef: true })

        spin(0).then(resolve)
      })
    },
    [playSound, setJackpot, setMultiplier],
  )

  const deal = async () => {
    // TODO: CHECK END GAME
    if (offer) {
      await acceptOfferMutation(offer.id)
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
      await playSound('chaching')
      await newGame()
    }
  }

  const startGame = useCallback(
    async (result?: { gameId: string; multiplier: string }) => {
      const bet = useSoloStore.getState().bet

      const { gameId, multiplier } =
        result ??
        (await startGameMutation({
          betAmount: String(bet) + '00',
        }))

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
      navigate(ROUTES.solo.game(gameId), { preventScrollReset: true })

      const multiplierIndex = MULTIPLIERS.findIndex(
        (value) => value === Number(multiplier),
      )

      if (multiplierIndex !== -1) {
        await getMultiplier(multiplierIndex)
      }
    },
    [getMultiplier, navigate, queryClient, startGameMutation],
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
    const genRunSound = victoryHandleRef.current?.runSound()

    await victoryHandleRef.current?.updateState({
      type: 'win',
      win: jackpot,
    })
    await victoryHandleRef.current?.show()
    await genRunSound?.next()
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
    await genRunSound?.next()

    newGame()
  }, [queryClient, jackpot, newGame])

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

      if (isGameOver) {
        await revolverHandleRef.current?.shot()
        await gameOver()
        return
      }
      if (isWin) {
        await winGame()
        return
      }

      setOffer(offer ?? null)
    },
    [gamePullMutation, setCountBullet, setOffer, gameOver, winGame],
  )

  const pull = useCallback(async () => {
    const bet = useSoloStore.getState().bet

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
  }, [gameId, pullGame, startGame])

  useEffect(() => {
    if (isStartedGame || !isPlay) {
      return
    }

    const activeGame = allGames.find((game) => game.status === 'ACTIVE')
    if (activeGame) {
      navigate(ROUTES.solo.game(activeGame.id), {
        preventScrollReset: true,
        replace: true,
      })
    }
  }, [allGames, navigate, isStartedGame, isPlay])

  useEffect(() => {
    if (!gameDetails) {
      return
    }

    setCountBullet(5 - Number(gameDetails.currentPosition ?? 0))
    setBet(gameDetails.formattedBetAmount ?? 0)
    setJackpot(gameDetails.formattedPotentialWin ?? 0)
    setMultiplier(Number(gameDetails.multiplier ?? 0))
    setOffer(gameDetails.currentOffer ?? null)

    const isGameOver = gameDetails.status === 'COMPLETED_LOSE'
    const isWin = gameDetails.status === 'COMPLETED_WIN'
    if (isGameOver) gameOver()
    if (isWin) winGame()
  }, [
    gameDetails,
    gameOver,
    newGame,
    setBet,
    setCountBullet,
    setJackpot,
    setMultiplier,
    setOffer,
    winGame,
  ])

  return {
    footerHandleRef,
    gameOverHandleRef,
    victoryHandleRef,
    revolverHandleRef,
    jackpotHandleRef,
    multiplierHandleRef,
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
    newGame,
    winGame,
    gameOver,
    pullGame,
  }
}

export { useSolo }
