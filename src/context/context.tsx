import React from 'react'

import { audios, SettingsKeys, State } from '@/lib/constants'

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
  settings: Record<SettingsKeys, boolean>
  setSettings: React.Dispatch<
    React.SetStateAction<Record<SettingsKeys, boolean>>
  >
  playAudio: (key: keyof typeof audios) => void
}

export const AppContext = React.createContext<ContextAppValue | null>(null)
