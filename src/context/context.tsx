import React from 'react'

import { audios, SettingsKeys, State } from '@/lib/constants'

interface ContextAppValue {
  state: State
  changeState: React.Dispatch<State>
  undoState: React.Dispatch<void>
  countBullet: number
  setCountBullet: React.Dispatch<number>
  balance: number
  // TODO: CHANGE NAME -> addBalance/setBalance
  addTotal: React.Dispatch<number>
  setTotal: React.Dispatch<number>
  bet: number
  setBet: React.Dispatch<number>
  activeMultiplierIndex: number
  hasMultiplier: boolean
  setActiveMultiplierIndex: React.Dispatch<number>
  setShowHelpers: React.Dispatch<boolean>
  showHelpers: boolean
  settings: Record<SettingsKeys, boolean>
  changeSettings: React.Dispatch<Partial<Record<SettingsKeys, boolean>>>
  playAudio: (key: keyof typeof audios) => Promise<HTMLAudioElement | null>
}

export const AppContext = React.createContext<ContextAppValue | null>(null)
