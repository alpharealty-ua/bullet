import React, { useReducer, useState } from 'react'

import { AppContext } from '@/context/context'
import { INIT_TOTAL, State } from '@/lib/constants'

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

  const [state, setState] = useState<State>('init-game')
  const [bet, setBet] = useState<number>(100)
  const [total, setTotal] = useState(INIT_TOTAL)
  const [activeMultiplierIndex, setActiveMultiplierIndex] = useState(-1)

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
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppProvider }
