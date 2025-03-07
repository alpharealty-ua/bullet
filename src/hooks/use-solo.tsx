import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'

import {
  useAllGames,
  useGameDetails,
  useGamePull,
  useStartGame,
} from '@/api/game.api'
import { useAddBalance, useBalance } from '@/api/wallet.api'
import { useSettingsStore } from '@/store/settings.store'
import { useSoloStore } from '@/store/solo.store'
import { ROUTES } from '@/routes/path'
import { randomIntFromInterval, wait } from '@/lib/utils'
import { MAX_BET, MULTIPLIERS } from '@/lib/constants'
import { RevolverHandle } from '@/components/guns/revolver'
import { GameBarHandle } from '@/components/duel-game-bar'
import { ReadySetPullHandle } from '@/components/ready-set-pull'
import { GunHandle } from '@/components/character-gun'

const useSolo = () => {
  const navigate = useNavigate()
  const { gameId } = useParams<{ gameId: string }>()
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
  const setCountBullet = useSoloStore(({ setCountBullet }) => setCountBullet)
  const setOffer = useSoloStore(({ setOffer }) => setOffer)
  const setBet = useSoloStore(({ setBet }) => setBet)
  const setState = useSoloStore(({ setState }) => setState)
  const setMultiplierIndex = useSoloStore(
    ({ setMultiplierIndex }) => setMultiplierIndex,
  )
  const setMultiplier = useSoloStore(({ setMultiplier }) => setMultiplier)
  const setIsStartedGame = useSoloStore(
    ({ setIsStartedGame }) => setIsStartedGame,
  )
  const setNoMoney = useSoloStore(({ setNoMoney }) => setNoMoney)
  const setJackpot = useSoloStore(({ setJackpot }) => setJackpot)
  const setMaxBet = useSoloStore(({ setMaxBet }) => setMaxBet)
  const newGame = useSoloStore(({ newGame }) => newGame)
  const state = useSoloStore(({ state }) => state)
  const isStartedGame = useSoloStore(({ isStartedGame }) => isStartedGame)
  const offer = useSoloStore(({ offer }) => offer)
  const bet = useSoloStore(({ bet }) => bet)
  const jackpot = useSoloStore(({ jackpot }) => jackpot)

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
    newGame(balance)
  }

  const next = async (format: 'solo' | 'duel') => {
    if (disabledRef.current) {
      return
    }

    try {
      disabledRef.current = true
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

    if (
      !(frontGunHandle && backGunHandle && readySetPullHandle && gameBarHandle)
    ) {
      return
    }

    if (isStartedGame) {
      const { value, isRunning } = await gameBarHandle.getState()

      if (isRunning) {
        await gameBarHandle.stop()
        const inWinGame = [50, 33, 20, 10].includes(value)

        await wait(1000)
        await playAudio('triggerpull')
        await backGunHandle.spin()
        await backGunHandle.click()

        if (inWinGame) {
          return await winGame()
        } else {
          await wait(1000)
          await playAudio('triggerpull')
          await frontGunHandle.spin()
          await frontGunHandle.click()

          const isGameOver = randomIntFromInterval(1, 5) === 1

          if (isGameOver) {
            await frontGunHandle.shot()
            // TODO: MOVE TO NEW GAME
            // setRound(1)
            await gameBarHandle.reset()
            return await gameOver()
          }
        }
      } else {
        const duration = randomIntFromInterval(25, 50)
        await gameBarHandle.start(duration)
      }
    } else {
      const promise = readySetPullHandle.start()
      navigate(`${ROUTES.duel.play}/1`)
      await promise
    }
  }

  const nextSolo = async () => {
    if (state === 'preparation') {
      await startGame()
      return
    }

    pullGame()
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
    await addBalanceMutation(-bet)
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

        // TODO: REMOVE 1000. ONLY FOR TEST
        await addBalanceMutation(jackpot || 1000)
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

    return promise.then(() => newGame(balance))
  }

  useEffect(() => {
    if (isStartedGame) {
      return
    }
    // TODO: REMOVE BALANCE
    // newGame(balance)
  }, [newGame, isStartedGame, balance])

  useEffect(() => {
    const activeGame = allGames.find((game) => game.status === 'ACTIVE')
    if (activeGame && !isStartedGame) {
      // navigate(`${ROUTES.solo.play}/${activeGame.id}`)
    }
  }, [allGames, navigate, isStartedGame])

  useEffect(() => {
    setIsStartedGame(Boolean(gameId))
  }, [gameId, setIsStartedGame])

  useEffect(() => {
    const maxBet = Math.min(isStartedGame ? bet + balance : balance, MAX_BET)
    setMaxBet(maxBet)
  }, [isStartedGame, balance, bet, gameId, setMaxBet])

  useEffect(() => {
    if (!(isStartedGame && gameDetails)) {
      return
    }

    const jackpot = Number(gameDetails.potentialWin ?? 0)
    const bet = Number(gameDetails.betAmount ?? 0)
    const isActive = gameDetails.status === 'ACTIVE'
    const isGameOver = gameDetails.status === 'COMPLETED_LOSE'

    setJackpot(jackpot)
    setBet(bet)
    isActive && setState('running')
    isGameOver && setState('game-over')
  }, [gameDetails, isStartedGame, setState, setJackpot, setBet])

  useEffect(() => {
    const noMoney = !isStartedGame && !(balance > 0 || bet > 0)
    setNoMoney(noMoney)
  }, [setNoMoney, isStartedGame, balance, bet])

  return {
    next,
    deal,
    revolverRefHandle,
    frontGunHandleRef,
    backGunHandleRef,
    gameBarRefHandle,
    readySetPullHandleRef,
  }
}

export { useSolo }
