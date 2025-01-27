import React, { useState } from 'react'

import { AppContext } from '@/context/context'
import { State } from '@/lib/constants'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [countBullet, setCountBullet] = useState(5)
  const [state, setState] = useState<State>('bet')
  const [bet, setBet] = useState<number>(100)
  const [total, setTotal] = useState(1075)
  const [activeMultiplierIndex, setActiveMultiplierIndex] = useState(1)

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        countBullet,
        setCountBullet,
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
