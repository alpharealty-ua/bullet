import { useCallback, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/api/api'
import {
  useAllGames,
  useGameDetails,
  useGamePull,
  useStartGame,
} from '@/api/game.api'
import { useAddBalance, useBalance } from '@/api/wallet.api'
import { useSettingsStore } from '@/store/settings.store'
import { useGameStore } from '@/store/game.store'
import { ROUTES } from '@/routes/path'
import { randomIntFromInterval, wait } from '@/lib/utils'
import { MAX_BET, MULTIPLIERS } from '@/lib/constants'
import { RevolverHandle } from '@/components/guns/revolver'
import { GameBarHandle } from '@/components/duel-game-bar'
import { ReadySetPullHandle } from '@/components/ready-set-pull'
import { GunHandle } from '@/components/character-gun'

const useGame = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { gameId } = useParams<{ gameId: string }>()
  const queryClient = useQueryClient()
  const revolverRefHandle = useRef<RevolverHandle>(null)
  const frontGunHandleRef = useRef<GunHandle>(null)
  const backGunHandleRef = useRef<GunHandle>(null)
  const gameBarRefHandle = useRef<GameBarHandle>(null)
  const readySetPullHandleRef = useRef<ReadySetPullHandle>(null)
  const disabledRef = useRef(false)
  const { data: gameDetails } = useGameDetails()
  const { mutateAsync: addBalanceMutation } = useAddBalance()
  const { mutateAsync: startGameMutation } = useStartGame()
  const { data: allGames = [] } = useAllGames()
  const { mutateAsync: gamePullMutation } = useGamePull()
  const { data: balance } = useBalance()
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const setCountBullet = useGameStore(({ setCountBullet }) => setCountBullet)
  const setOffer = useGameStore(({ setOffer }) => setOffer)
  const setBet = useGameStore(({ setBet }) => setBet)
  const setState = useGameStore(({ setState }) => setState)
  const setMultiplierIndex = useGameStore(
    ({ setMultiplierIndex }) => setMultiplierIndex,
  )
  const setMultiplier = useGameStore(({ setMultiplier }) => setMultiplier)
  const setIsStartedGame = useGameStore(
    ({ setIsStartedGame }) => setIsStartedGame,
  )
  const setNoMoney = useGameStore(({ setNoMoney }) => setNoMoney)
  const setJackpot = useGameStore(({ setJackpot }) => setJackpot)
  const setMaxBet = useGameStore(({ setMaxBet }) => setMaxBet)
  const restartGame = useGameStore(({ newGame }) => newGame)
  const state = useGameStore(({ state }) => state)
  const isStartedGame = useGameStore(({ isStartedGame }) => isStartedGame)
  const offer = useGameStore(({ offer }) => offer)
  const bet = useGameStore(({ bet }) => bet)
  const isSolo = pathname.includes(ROUTES.solo.root)

  const newGame = useCallback(async () => {
    const gameBarHandle = gameBarRefHandle.current

    if (gameBarHandle) {
      await gameBarHandle.reset()
    }

    if (gameId) {
      navigate(isSolo ? ROUTES.solo.play : ROUTES.duel.play)
    }
    queryClient.setQueryData([QUERY_KEYS.gameDetails], null)

    restartGame()
  }, [restartGame, isSolo, navigate, queryClient, gameId])

  const getMultiplier = async (multiplierIndex: number): Promise<void> => {
    const revolverHandle = revolverRefHandle.current

    if (revolverHandle === null) {
      return
    }

    const length = MULTIPLIERS.length
    const AMOUNT_CHAMBER =
      length * Math.round(randomIntFromInterval(20, 30) / length) +
      multiplierIndex

    const END_DELAY = 400
    const DURATION_AUDIO = 1500 - END_DELAY
    const interval = DURATION_AUDIO / AMOUNT_CHAMBER

    let count = AMOUNT_CHAMBER
    let index = 0

    await playAudio('spin')

    return new Promise<void>((resolve) => {
      const spin = async () => {
        if (count-- > 0) {
          await revolverHandle.spin(interval)
          const newIndex = ++index % MULTIPLIERS.length
          const multiplier = MULTIPLIERS[newIndex]
          // TODO: REMOVE INDEX
          setMultiplierIndex(newIndex)
          setMultiplier(multiplier)
          setJackpot(bet * multiplier)
          spin()
        } else {
          resolve()
        }
      }

      spin()
    })
  }

  const deal = async () => {
    if (offer > 0) {
      await playAudio('chaching')
      await addBalanceMutation(offer + bet)
      setOffer(0)
    }
    await newGame()
  }

  const next = async (format: 'solo' | 'duel') => {
    if (disabledRef.current) {
      return
    }

    try {
      disabledRef.current = true

      if (state === 'win' || state === 'game-over') {
        await newGame()
        return
      }

      format === 'solo' ? await nextSolo() : await nextDuel()
    } catch (e) {
      console.log(e)
    } finally {
      disabledRef.current = false
    }
  }

  const nextDuel = async () => {
    const frontGunHandle = frontGunHandleRef.current
    const backGunHandle = backGunHandleRef.current
    const readySetPullHandle = readySetPullHandleRef.current
    const gameBarHandle = gameBarRefHandle.current

    if (!(readySetPullHandle && gameBarHandle)) {
      return
    }

    if (isStartedGame) {
      const { value, isRunning } = await gameBarHandle.getState()

      if (isRunning) {
        if (!(frontGunHandle && backGunHandle)) {
          return
        }

        const isGameOver = value === 50
        const winProbabilityPercentage = isGameOver ? 0 : value
        const random = randomIntFromInterval(0, 99)
        const inWinGame = random < winProbabilityPercentage

        await wait(1000)
        await playAudio('triggerpull')
        await backGunHandle.spin()
        await backGunHandle.click()

        await wait(1000)
        await playAudio('triggerpull')
        await frontGunHandle.spin()
        await frontGunHandle.click()

        if (inWinGame) {
          await wait(500)
          return await winGame()
        }

        if (isGameOver) {
          await frontGunHandle.shot()
          return await gameOver()
        }
      } else {
        const duration = randomIntFromInterval(25, 50)
        await gameBarHandle.start(duration)
      }
    } else {
      await readySetPullHandle.start()
      const duration = randomIntFromInterval(25, 50)
      await gameBarHandle.start(duration)
      navigate(`${ROUTES.duel.play}/1`, { preventScrollReset: true })
    }
  }

  const nextSolo = async () => {
    if (state === 'preparation') {
      await startGame()
      return
    }

    await pullGame()
  }

  const startGame = async () => {
    if (state !== 'preparation') {
      return
    }

    const { gameId, multiplier } = await startGameMutation({
      betAmount: String(bet),
    })
    // .catch(() => ({ gameId: 1, multiplier: 100 }))

    setState('running')
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
    const multiplierIndex = MULTIPLIERS.findIndex(
      (value) => value === Number(multiplier),
    )

    if (multiplierIndex === -1) {
      return
    }

    await getMultiplier(multiplierIndex)
    navigate(`${ROUTES.solo.play}/${gameId}`)
  }

  const pullGame = async () => {
    if (state !== 'running') {
      return
    }

    if (!gameId) {
      return
    }

    const revolverHandle = revolverRefHandle.current

    if (revolverHandle === null) {
      return
    }

    const { success, position } = await gamePullMutation(gameId)
    // .catch(() => ({
    //   success: true,
    //   position: 3,
    // }))

    const isGameOver = !success
    const isWin = !isGameOver && position === 5

    setCountBullet(5 - position)

    await playAudio('triggerpull')
    await revolverHandle.spin()
    revolverHandle.click()

    if (isGameOver) {
      await gameOver()
      return
    }
    if (isWin) {
      await winGame()
      return
    }
  }

  const gameOver = async () => {
    setState('game-over')
  }

  const winGame = async () => {
    setState('win')

    const winSoundAudio = await playAudio('winsound', false)
    const chachingAudio = await playAudio('chaching', false)

    const startAudio = await new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(false))
      chachingAudio.addEventListener('play', () => resolve(true))
    })

    const promise = new Promise<void>((resolve) => {
      const winSoundEnded = () => {
        resolve()
      }

      const chachingEnded = async () => {
        winSoundAudio.addEventListener('ended', winSoundEnded, {
          once: true,
        })

        await addBalanceMutation(1000)
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
      }

      chachingAudio.addEventListener('ended', chachingEnded, {
        once: true,
      })
      if (!startAudio) {
        chachingAudio.dispatchEvent(new Event('play'))
        chachingAudio.dispatchEvent(new Event('ended'))
        winSoundAudio.dispatchEvent(new Event('play'))
        winSoundAudio.dispatchEvent(new Event('ended'))
      }
    })

    return promise.then(newGame)
  }

  useEffect(() => {
    const activeGame = allGames.find((game) => game.status === 'ACTIVE')
    if (activeGame && !gameId) {
      // setState('running')
      // navigate(`${ROUTES.solo.play}/${activeGame.id}`)
    }
  }, [allGames, navigate, gameId, setState])

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
    const isActive = gameDetails.status === 'ACTIVE'
    const isPending = gameDetails.status === 'PENDING'
    const isGameOver = gameDetails.status === 'COMPLETED_LOSE'
    const isWin = gameDetails.status === 'COMPLETED_WIN'

    setJackpot(jackpot)
    setBet(bet)
    setCountBullet(countBullet)
    setMultiplier(multiplier)
    ;(isActive || isPending) && setState('running')
    isGameOver && setState('game-over')
    isWin && setState('win')
  }, [
    gameDetails,
    setState,
    setJackpot,
    setBet,
    setCountBullet,
    setMultiplier,
    setIsStartedGame,
    gameId,
  ])

  useEffect(() => {
    const noMoney = !isStartedGame && !(balance > 0 || bet > 0)
    setNoMoney(noMoney)
  }, [setNoMoney, isStartedGame, balance, bet])

  useEffect(() => {
    setIsStartedGame(Boolean(gameId))

    if (gameId) {
      return
    }

    newGame()
  }, [gameId, newGame, setIsStartedGame])

  return {
    next,
    deal,
    newGame: newGame,
    revolverRefHandle,
    frontGunHandleRef,
    backGunHandleRef,
    gameBarRefHandle,
    readySetPullHandleRef,
  }
}

export { useGame as useSolo }
