import React, { useContext } from 'react'
import { State } from './utils/constacts'

interface ContextAppValue {
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
  countBullet: number
  setCountBullet: React.Dispatch<number>
  total: number
  setTotal: React.Dispatch<number>
  bet: number
  setBet: React.Dispatch<number>
  activeMultiplierIndex: number
  setActiveMultiplierIndex: React.Dispatch<number>
}
export const AppContext = React.createContext<ContextAppValue | null>(null)

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (context === null) {
    throw new Error('Context not found')
  }

  return context
}
