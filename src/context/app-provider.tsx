import React, { useCallback, useReducer, useState } from 'react'

import { AppContext } from '@/context/context'
import { playAudio } from '@/lib/utils'
import { SettingsKeys, State, audios } from '@/lib/constants'
import { appReducer, initState } from './app-reducer'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [
    {
      countBullet,
      state,
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

  return (
    <AppContext.Provider
      value={{
        state,
        changeState,
        undoState,
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
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppProvider }
