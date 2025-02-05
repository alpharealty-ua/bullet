import React, { useCallback, useReducer } from 'react'

import { AppContext } from '@/context/context'
import { INIT_TOTAL, SettingsKeys, State, audios } from '@/lib/constants'

interface SetBulletAction {
  type: 'set-bullet'
  payload: number
}

interface ChangeStateAction {
  type: 'change-state'
  payload: State
}

interface UndoStateAction {
  type: 'undo-state'
  // eslint-disable-next-line
  payload?: any
}

interface SetTotalAction {
  type: 'set-total'
  payload: number
}
interface AddTotalAction {
  type: 'add-total'
  payload: number
}

interface SetBetAction {
  type: 'set-bet'
  payload: number
}

interface SetMultiplierIndexAction {
  type: 'set-multiplier-index'
  payload: number
}
interface ChangeSettingsAction {
  type: 'change-settings'
  payload: Partial<Record<SettingsKeys, boolean>>
}

interface GameState {
  stateHistory: State[]
  state: State
  countBullet: number
  total: number
  bet: number
  activeMultiplierIndex: number
  settings: Record<SettingsKeys, boolean>
}

type Actions =
  | SetBulletAction
  | ChangeStateAction
  | UndoStateAction
  | SetTotalAction
  | AddTotalAction
  | SetBetAction
  | SetMultiplierIndexAction
  | ChangeSettingsAction

const appReducer = (state: GameState, action: Actions): GameState => {
  const { type, payload } = action

  switch (type) {
    case 'set-bullet':
      return {
        ...state,
        countBullet: payload,
      }
    case 'change-state':
      return {
        ...state,
        stateHistory: [...state.stateHistory, payload],
        state: payload,
      }
    case 'undo-state': {
      const stateHistory = [...state.stateHistory]
      stateHistory.pop()
      const newState = stateHistory[stateHistory.length - 1]
      return {
        ...state,
        stateHistory,
        state: newState,
      }
    }
    case 'set-total':
      return { ...state, total: payload }
    case 'add-total':
      return { ...state, total: state.total + payload }
    case 'set-bet':
      return { ...state, bet: payload }
    case 'set-multiplier-index':
      return { ...state, activeMultiplierIndex: payload }
    case 'change-settings':
      return { ...state, settings: { ...state.settings, ...payload } }
    default:
      return state
  }
}

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [
    { countBullet, state, total, bet, activeMultiplierIndex, settings },
    dispatch,
  ] = useReducer(appReducer, {
    stateHistory: ['cover'],
    state: 'cover',
    countBullet: 5,
    total: INIT_TOTAL,
    bet: 0,
    activeMultiplierIndex: -1,
    settings: {
      music: true,
      soundEffects: true,
      invertButtons: false,
      blood: false,
    },
  })

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
