import React, { useReducer, useState } from 'react'

import { AppContext } from '@/context/context'
import { INIT_TOTAL, SettingsKeys, State, audios } from '@/lib/constants'

type ActionType = 'bullet'

// An interface for our actions
interface CountAction {
  type: ActionType
  payload: number
}

// An interface for our state
interface CountState {
  state: State
  countBullet: number
}

const appReducer = (state: CountState, action: CountAction): CountState => {
  const { type, payload } = action

  switch (type) {
    case 'bullet':
      return {
        ...state,
        countBullet: payload,
      }
    default:
      return state
  }
}

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // create useResucer
  const [{ countBullet }, dispatch] = useReducer(appReducer, {
    state: 'cover',
    countBullet: 5,
  })

  const [state, setState] = useState<State>('cover')
  const [bet, setBet] = useState<number>(0)
  const [total, setTotal] = useState(INIT_TOTAL)
  const [activeMultiplierIndex, setActiveMultiplierIndex] = useState(-1)
  const [settings, setSettings] = useState<Record<SettingsKeys, boolean>>({
    music: true,
    soundEffects: true,
    invertButtons: false,
    blood: true,
  })

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
        setState,
        countBullet,
        setCountBullet: (payload: number | ((prev: number) => number)) => {
          dispatch({
            type: 'bullet',
            payload:
              typeof payload === 'function' ? payload(countBullet) : payload,
          })
        },
        total,
        setTotal,
        bet,
        setBet,
        activeMultiplierIndex,
        setActiveMultiplierIndex,
        settings,
        setSettings,
        playAudio,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppProvider }
