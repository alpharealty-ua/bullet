import React, { useCallback, useReducer, useRef, useState } from 'react'

import { AppContext } from '@/context/context'
import { playAudio, randomIntFromInterval, wait } from '@/lib/utils'
import {
  SettingsKeys,
  State,
  audios,
  getMultiplierValueByIndex,
  multipliers,
} from '@/lib/constants'
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
  const [disabled, setDisabled] = useState(false)
  const disabledRef = useRef(disabled)
  const revolverRefHandle = useRef<{
    spin: (interval: number) => Promise<void>
  }>(null)

  const changeState = useCallback((payload: State) => {
    dispatch({ type: 'change-state', payload })
  }, [])

  const undoState = useCallback(() => {
    dispatch({ type: 'undo-state' })
  }, [])

  const playAudioWrapper = async (
    key: keyof typeof audios,
  ): Promise<HTMLAudioElement | null> => {
    if (!settings.soundEffects) {
      return null
    }

    return playAudio(key)
  }

  const addRank = useCallback((payload: number) => {
    dispatch({ type: 'add-rank', payload })
  }, [])

  const context = {
    state,
    changeState,
    undoState,
    rank,
    countBullet,
    setCountBullet: useCallback((payload: number) => {
      dispatch({ type: 'set-bullet', payload })
    }, []),
    balance,
    setBalance: useCallback((payload: number) => {
      dispatch({ type: 'set-balance', payload })
    }, []),
    addBalance: useCallback((payload: number) => {
      dispatch({ type: 'add-balance', payload })
    }, []),
    bet,
    setBet: useCallback((payload: number) => {
      dispatch({ type: 'set-bet', payload })
    }, []),
    activeMultiplierIndex,
    setActiveMultiplierIndex: useCallback((payload: number) => {
      dispatch({ type: 'set-multiplier-index', payload })
    }, []),
    showHelpers,
    setShowHelpers: useCallback((payload: boolean) => {
      dispatch({ type: 'set-show-helpers', payload })
    }, []),
    settings,
    changeSettings: useCallback(
      (payload: Partial<Record<SettingsKeys, boolean>>) => {
        dispatch({ type: 'change-settings', payload })
      },
      [],
    ),
    offer,
    setOffer,
    showJackpot,
    setShowJackpot,
    showOffer,
    setShowOffer,
    showClick,
    setShowClick,
    playAudio: playAudioWrapper,
    jackpot,
    setDisabled,
    disabled,
  }

  const newGame = async () => {
    await wait(0) // need for update states
    const hasPrevBet = bet !== 0
    const prevBet = hasPrevBet ? (bet > balance ? balance : bet) : 0

    changeState('preparation')
    context.setBet(prevBet)
    setOffer(0)
    context.setCountBullet(5)
    context.setActiveMultiplierIndex(-1)
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
          context.setActiveMultiplierIndex(newIndex)
          spin()
        } else {
          resolve(index)
        }
      }

      spin()
    })
  }

  const mouseClick = async (
    callback?: () => void | Promise<void>,
  ): Promise<void> => {
    const disabled = disabledRef.current

    if (disabled) {
      return
    }

    disabledRef.current = true

    const BTN_TRANSITION_DURATION = 200
    setTimeout(() => {
      if (disabledRef.current) {
        setDisabled(true)
      }
    }, BTN_TRANSITION_DURATION)

    const audio = await playAudio('mouseclick')

    const promise = new Promise<void>((resolve) => {
      audio.addEventListener(
        'ended',
        async () => {
          if (!callback) {
            resolve()
            return
          }
          await callback()
          resolve()
        },
        { once: true },
      )
    })

    return promise.then((result) => {
      setDisabled(false)
      disabledRef.current = false
      return result
    })
  }

  const deal = async () => {
    if (offer > 0) {
      await playAudio('chaching')
      context.addBalance(offer + bet)
      setOffer(0)
      addRank(2)
    }
    newGame()
  }

  const next = async () => {
    if (state === 'preparation') {
      changeState('running')
      setShowJackpot(false)
      context.addBalance(-bet)
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

    context.setCountBullet(newCountBullet)
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
    const drumBeatAudio = await playAudio('drumbeat', false)
    const audio = await playAudio('gunshot')

    changeState('game-over')
    addRank(-5)

    audio.addEventListener(
      'ended',
      () => {
        drumBeatAudio.play()
      },
      { once: true },
    )
  }

  const winGame = async () => {
    changeState('win')

    addRank(5)
    await playAudio('chaching')
    await wait(1000)
    const audio = await playAudio('winsound')

    // TODO: REMOVE 1000. ONLY FOR TEST
    context.addBalance(jackpot || 1000)

    return new Promise<void>((resolve) => {
      audio.addEventListener('ended', () => {
        newGame()
        resolve()
      })
    })
  }

  return (
    <AppContext.Provider
      value={{
        ...context,
        game: {
          deal,
          newGame,
          gameOver,
          next,
          winGame,
        },
        mouseClick,
        revolverRefHandle,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppProvider }
