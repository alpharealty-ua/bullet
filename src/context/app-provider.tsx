import React, { useCallback, useReducer, useRef, useState } from 'react'

import { AppContext } from '@/context/context'
import { getAudio, randomIntFromInterval, wait } from '@/lib/utils'
import {
  SettingsKeys,
  State,
  audios,
  getMultiplierValueByIndex,
  multipliers,
} from '@/lib/constants'
import { Debug } from '@/components/debug'
import { appReducer, initState } from './app-reducer'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [
    {
      countBullet,
      state,
      rank,
      balance,
      bet,
      activeMultiplierIndex,
      settings,
      showHelpers,
    },
    dispatch,
  ] = useReducer(appReducer, initState)
  // TODO: MOVE TO REDUCER
  const [offer, setOffer] = useState(0)
  const [showJackpot, setShowJackpot] = useState(false)
  const [showOffer, setShowOffer] = useState(false)
  const [showClick, setShowClick] = useState(false)
  const jackpot = bet * getMultiplierValueByIndex(activeMultiplierIndex)
  const revolverRefHandle = useRef<{
    spin: (interval: number) => Promise<void>
  }>(null)
  const [characterIndex, setCharacterIndex] = useState(0)

  const changeState = useCallback((payload: State) => {
    dispatch({ type: 'change-state', payload })
  }, [])

  // @ts-ignore
  const undoState = useCallback(() => {
    dispatch({ type: 'undo-state' })
  }, [])

  const playAudio = useCallback(
    async (
      key: keyof typeof audios,
      play = true,
    ): Promise<HTMLAudioElement> => {
      const audio = getAudio(key)

      audio.addEventListener(
        'ended',
        () => {
          console.log('Play audio - ' + audio.src)
        },
        { once: true },
      )

      try {
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

  const addRank = useCallback((payload: number) => {
    dispatch({ type: 'add-rank', payload })
  }, [])

  const setCountBullet = useCallback((payload: number) => {
    dispatch({ type: 'set-bullet', payload })
  }, [])

  const setBalance = useCallback((payload: number) => {
    dispatch({ type: 'set-balance', payload })
  }, [])

  const setActiveMultiplierIndex = useCallback((payload: number) => {
    dispatch({ type: 'set-multiplier-index', payload })
  }, [])

  const setShowHelpers = useCallback((payload: boolean) => {
    dispatch({ type: 'set-show-helpers', payload })
  }, [])

  const changeSettings = useCallback(
    (payload: Partial<Record<SettingsKeys, boolean>>) => {
      dispatch({ type: 'change-settings', payload })
    },
    [],
  )

  const addBalance = useCallback((payload: number) => {
    dispatch({ type: 'add-balance', payload })
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
    setShowJackpot(false)
    setShowOffer(false)
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
      addBalance(offer + bet)
      setOffer(0)
      addRank(2)
    }
    newGame()
  }

  const next = async () => {
    setShowHelpers(false)
    setShowOffer(false)

    if (state === 'preparation') {
      changeState('running')
      setShowJackpot(false)
      addBalance(-bet)
      await getMultiplier()
      setOffer(0)
      setShowJackpot(true)

      return
    }

    const revolverHandle = revolverRefHandle.current

    if (revolverHandle === null) {
      return
    }

    setOffer(0)
    setShowJackpot(true)
    setShowOffer(false)

    const random = randomIntFromInterval(1, 6)
    const newCountBullet = countBullet - 1

    const isGameOver = random === 1
    const isWin = !isGameOver && newCountBullet === 0

    setCountBullet(newCountBullet)
    setShowClick(false)

    await playAudio('triggerpull')
    await revolverHandle.spin(200)

    setShowClick(true)

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
      setShowOffer(true)
    }
  }

  const gameOver = async () => {
    changeState('game-over')
    addRank(3)
  }

  const winGame = async () => {
    changeState('win')
    addRank(5)

    await playAudio('chaching')
    await wait(1000)
    const audio = await playAudio('winsound')

    // TODO: REMOVE 1000. ONLY FOR TEST
    addBalance(jackpot || 1000)

    return new Promise<void>((resolve) => {
      audio.addEventListener('ended', () => {
        newGame()
        resolve()
      })
    })
  }

  const game = {
    deal,
    newGame,
    gameOver,
    next,
    winGame,
  }

  return (
    <AppContext.Provider
      value={{
        state,
        changeState,
        rank,
        countBullet,
        balance,
        addBalance,
        bet,
        setBet,
        activeMultiplierIndex,
        showHelpers,
        characterIndex,
        setCharacterIndex,
        settings,
        changeSettings,
        offer,
        showJackpot,
        showOffer,
        showClick,
        playAudio,
        jackpot,
        revolverRefHandle,
        game,
      }}
    >
      <Debug
        {...{
          state,
          changeState,
          balance,
          setBalance,
          countBullet,
          setCountBullet,
          bet,
          setBet,
          activeMultiplierIndex,
          setActiveMultiplierIndex,
          game,
        }}
      />
      {children}
    </AppContext.Provider>
  )
}

export { AppProvider }
