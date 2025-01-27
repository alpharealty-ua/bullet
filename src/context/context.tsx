import React from 'react'

import { State } from '@/utils/constants'

interface ContextAppValue {
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
  countBullet: number
  setCountBullet: React.Dispatch<React.SetStateAction<number>>
  total: number
  setTotal: React.Dispatch<React.SetStateAction<number>>
  bet: number
  setBet: React.Dispatch<React.SetStateAction<number>>
  activeMultiplierIndex: number
  setActiveMultiplierIndex: React.Dispatch<React.SetStateAction<number>>
}

export const AppContext = React.createContext<ContextAppValue | null>(null)
