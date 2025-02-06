import React, { useCallback, useReducer } from 'react'

import { AppContext } from '@/context/context'
import { SettingsKeys, State, audios } from '@/lib/constants'
import { appReducer, initState } from './app-reducer'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [
    { countBullet, state, total, bet, activeMultiplierIndex, settings },
    dispatch,
  ] = useReducer(appReducer, initState)

  const changeState = useCallback((payload: State) => {
    dispatch({ type: 'change-state', payload })
  }, [])

  const undoState = useCallback(() => {
    dispatch({ type: 'undo-state' })
  }, [])

  const playAudio = (key: keyof typeof audios) => {
    if (!settings.soundEffects) {
      return
    }

    const audios = document.getElementById('audios')

    if (audios === null) {
      return
    }

    const selector = `.audio-${key}`

    const audio = audios.querySelector(selector) as HTMLAudioElement

    if (audio === null) {
      return
    }

    audio
      .play()
      .then(() => {
        console.log('Play audio - ' + audio.src)
      })
      .catch(console.log)
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
        total,
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
        setActiveMultiplierIndex: useCallback((payload: number) => {
          dispatch({ type: 'set-multiplier-index', payload })
        }, []),
        settings,
        changeSettings: useCallback(
          (payload: Partial<Record<SettingsKeys, boolean>>) => {
            dispatch({ type: 'change-settings', payload })
          },
          [],
        ),
        playAudio,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppProvider }
