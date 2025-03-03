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
import { GunHandle } from '@/components/revolver'

const useSolo = () => {
  const navigate = useNavigate()
  const { gameId } = useParams<{ gameId: string }>()
  const revolverRefHandle = useRef<GunHandle>(null)
  const disabledRef = useRef(false)
  const { data: gameDetails } = useGameDetails()
  const { mutateAsync: addBalanceMutation } = useAddBalance()
  const { mutateAsync: startGameMutation } = useStartGame()
  const { data: allGames = [] } = useAllGames()
  const { mutateAsync: gamePullMutation } = useGamePull()
  const { data: balance } = useBalance()
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const declineAllDeals = useSettingsStore(
    ({ declineAllDeals }) => declineAllDeals,
  )
  const setCountBullet = useSoloStore(({ setCountBullet }) => setCountBullet)
  const setOffer = useSoloStore(({ setOffer }) => setOffer)
  const setBet = useSoloStore(({ setBet }) => setBet)
  const setState = useSoloStore(({ setState }) => setState)
  const setMultiplierIndex = useSoloStore(
    ({ setMultiplierIndex }) => setMultiplierIndex,
  )
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
          setMultiplierIndex(newIndex)
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

  const next = async () => {
    if (disabledRef.current) {
      return
    }

    try {
      disabledRef.current = true
      await nextSolo()
    } catch (e) {
      console.log(e)
    } finally {
      disabledRef.current = false
    }
  }

  const nextSolo = async () => {
    if (!gameId) {
      const { gameId, multiplier } = await startGameMutation({
        betAmount: String(bet),
      })
      console.log('call')
      setState('running')
      await addBalanceMutation(-bet)
      await getMultiplier(Number(multiplier))
      navigate(`${ROUTES.solo.play}/${gameId}`)
      setOffer(0)

      return
    }

    const revolverHandle = revolverRefHandle.current

    if (revolverHandle === null) {
      return
    }

    const { success, position } = await gamePullMutation(gameId)
    setOffer(0)

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
    if (!declineAllDeals) {
      setOffer(100)
    }
  }

  const gameOver = async () => {
    setState('game-over')
  }

  const winGame = async () => {
    setState('win')
    // TODO: REMOVE 1000. ONLY FOR TEST
    await addBalanceMutation(jackpot || 1000)

    const winSoundAudio = await playAudio('winsound', false)
    const chachingAudio = await playAudio('chaching')

    const winSoundEnded = (resolve: () => void) => () => {
      newGame(balance)
      resolve()
    }

    const chachingEnded = (resolve: () => void) => async () => {
      winSoundAudio.play()

      winSoundAudio.addEventListener('ended', winSoundEnded(resolve), {
        once: true,
      })
    }

    return new Promise<void>((resolve) => {
      chachingAudio.addEventListener('ended', chachingEnded(resolve), {
        once: true,
      })
    })
  }

  useEffect(() => {
    if (isStartedGame) {
      return
    }
    console.log('call')
    newGame(balance)
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

  return { next, deal, revolverRefHandle }
}

export { useSolo }
