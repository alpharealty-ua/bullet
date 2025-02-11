import React, { useCallback, useReducer } from 'react'

import { AppContext } from '@/context/context'
import { SettingsKeys, State, audios } from '@/lib/constants'
import { appReducer, initState } from './app-reducer'

const playAudio = async (
  key: keyof typeof audios,
): Promise<HTMLAudioElement | null> => {
  const audios = document.getElementById('audios')

  if (audios === null) {
    return null
  }

  const selector = `.audio-${key}`

  const audio = audios.querySelector(selector) as HTMLAudioElement

  if (audio === null) {
    return null
  }

  try {
    await audio.play()
    console.log('Play audio - ' + audio.src)

    return audio
  } catch (error) {
    console.log(error)

    return null
  }
}

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
        setTotal: useCallback((payload: number) => {
          dispatch({ type: 'set-total', payload })
        }, []),
        addTotal: useCallback((payload: number) => {
          dispatch({ type: 'add-total', payload })
        }, []),
        bet,
        setBet: useCallback((payload: number) => {
          dispatch({ type: 'set-bet', payload })
        }, []),
        activeMultiplierIndex,
        hasMultiplier: activeMultiplierIndex !== -1,
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
        playAudio: playAudioWrapper,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppProvider }
