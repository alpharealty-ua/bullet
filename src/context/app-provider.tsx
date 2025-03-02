import React, { useCallback, useReducer, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { useGamePull, useStartGame } from '@/api/game.api'
import { useAddBalance, useBalance } from '@/api/wallet.api'
import { ROUTES } from '@/routes/path'
import { AppContext } from '@/context/context'
import { getAudio, randomIntFromInterval, wait } from '@/lib/utils'
import {
  FormatGame,
  State,
  audios,
  getMultiplierValueByIndex,
  multipliers,
} from '@/lib/constants'
import { Debug } from '@/components/debug'
import { appReducer, initState } from './app-reducer'
import { GunHandle } from '@/components/revolver'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [
    {
      countBullet,
      state,
      bet,
      activeMultiplierIndex,
      // TODO: USE ZUSTAND
      settings,
    },
    dispatch,
  ] = useReducer(appReducer, initState)
  // TODO: MOVE TO REDUCER
  const [offer, setOffer] = useState(0)
  const jackpot = bet * getMultiplierValueByIndex(activeMultiplierIndex)
  const revolverRefHandle = useRef<GunHandle>(null)
  const [characterIndex, setCharacterIndex] = useState(0)
  const disabledRef = useRef(false)
  const { mutateAsync: addBalanceMutation } = useAddBalance()
  const { mutateAsync: startGameMutation } = useStartGame()
  const { mutateAsync: gamePullMutation } = useGamePull()
  const { data: balance } = useBalance()
  const navigate = useNavigate()

  const changeState = useCallback((payload: State) => {
    dispatch({ type: 'change-state', payload })
  }, [])

  const playAudio = useCallback(
    async (
      key: keyof typeof audios,
      play = true,
    ): Promise<HTMLAudioElement> => {
      const audio = getAudio(key)

      // TODO: MOVE TO ADUIO
      audio.addEventListener(
        'ended',
        () => {
          console.log('Play audio - ' + audio.src)
        },
        { once: true },
      )

      try {
        // TODO: MOVE TO ADUIO
        audio.muted = !settings.soundEffects
        if (play) {
          await audio.play()
        }

        return audio
      } catch (error) {
        console.log(error)
      }

      return audio
    },
    [settings],
  )

  const setCountBullet = useCallback((payload: number) => {
    dispatch({ type: 'set-bullet', payload })
  }, [])

  const setActiveMultiplierIndex = useCallback((payload: number) => {
    dispatch({ type: 'set-multiplier-index', payload })
  }, [])

  const setBet = useCallback((payload: number) => {
    dispatch({ type: 'set-bet', payload })
  }, [])

  const newGame = async () => {
    await wait(0) // need for update states
    const hasPrevBet = bet !== 0
    const prevBet = hasPrevBet ? (bet > balance ? balance : bet) : 0

    changeState('preparation')
    setBet(prevBet)
    setOffer(0)
    setCountBullet(5)
    setActiveMultiplierIndex(-1)
  }

  const getMultiplier = async (): Promise<number> => {
    const revolverHandle = revolverRefHandle.current

    if (revolverHandle === null) {
      return -1
    }

    const AMOUNT_CHAMBER = randomIntFromInterval(18, 30)
    const DURATION_AUDIO = 1500
    const interval = DURATION_AUDIO / AMOUNT_CHAMBER

    let count = AMOUNT_CHAMBER
    let index = 0

    await playAudio('spin')

    return new Promise<number>((resolve) => {
      const spin = async () => {
        if (count-- > 0) {
          await revolverHandle.spin(interval)
          const newIndex = index++ % multipliers.length
          setActiveMultiplierIndex(newIndex)
          spin()
        } else {
          resolve(index)
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
    newGame()
  }

  const next = async (format: FormatGame, gameId?: string) => {
    if (disabledRef.current) {
      return
    }

    disabledRef.current = true

    try {
      if (format === 'solo') {
        await nextSolo(gameId)
      } else {
        await nextDeal()
      }
    } catch (e) {
      console.log(e)
    }

    disabledRef.current = false
  }

  const nextSolo = async (gameId?: string) => {
    if (!gameId) {
      const { gameId } = await startGameMutation({ betAmount: '10' })
      changeState('running')
      await addBalanceMutation(-bet)
      await getMultiplier()
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
    await revolverHandle.click()

    if (isGameOver) {
      await gameOver()
      return
    }
    if (isWin) {
      await winGame()
      return
    }
    if (!settings.declineAllDeals) {
      setOffer(100)
    }
  }

  // TODO: TEMPORARY SOLUTION
  const nextDeal = async () => {
    if (state === 'preparation') {
      changeState('running')
      return
    }

    await gameOver()
  }

  const gameOver = async () => {
    changeState('game-over')
  }

  const winGame = async () => {
    changeState('win')
    // TODO: REMOVE 1000. ONLY FOR TEST
    await addBalanceMutation(jackpot || 1000)

    const winSoundAudio = await playAudio('winsound', false)
    const chachingAudio = await playAudio('chaching')

    const winSoundEnded = (resolve: () => void) => () => {
      newGame()
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

  return (
    <AppContext.Provider
      value={{
        state,
        changeState,
        countBullet,
        bet,
        setBet,
        activeMultiplierIndex,
        characterIndex,
        setCharacterIndex,
        offer,
        playAudio,
        jackpot,
        revolverRefHandle,
        deal,
        next,
      }}
    >
      <Debug
        {...{
          state,
          changeState,
          balance,
          countBullet,
          setCountBullet,
          activeMultiplierIndex,
          setActiveMultiplierIndex,
        }}
      />
      {children}
    </AppContext.Provider>
  )
}

export { AppProvider }
