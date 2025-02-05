import React from 'react'

import { audios, SettingsKeys, State } from '@/lib/constants'

interface ContextAppValue {
  state: State
  changeState: React.Dispatch<State>
  undoState: React.Dispatch<void>
  countBullet: number
  setCountBullet: React.Dispatch<number>
  total: number
  addTotal: React.Dispatch<number>
  setTotal: React.Dispatch<number>
  bet: number
  setBet: React.Dispatch<number>
  activeMultiplierIndex: number
  setActiveMultiplierIndex: React.Dispatch<number>
  settings: Record<SettingsKeys, boolean>
  changeSettings: React.Dispatch<Partial<Record<SettingsKeys, boolean>>>
  playAudio: (key: keyof typeof audios) => void
}

export const AppContext = React.createContext<ContextAppValue | null>(null)
