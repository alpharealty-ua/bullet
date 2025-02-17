import React from 'react'

import { audios, SettingsKeys, State } from '@/lib/constants'

interface ContextAppValue {
  state: State
  changeState: React.Dispatch<State>
  undoState: React.Dispatch<void>
  countBullet: number
  setCountBullet: React.Dispatch<number>
  balance: number
  addBalance: React.Dispatch<number>
  setBalance: React.Dispatch<number>
  bet: number
  setBet: React.Dispatch<number>
  activeMultiplierIndex: number
  setActiveMultiplierIndex: React.Dispatch<number>
  setShowHelpers: React.Dispatch<boolean>
  showHelpers: boolean
  settings: Record<SettingsKeys, boolean>
  changeSettings: React.Dispatch<Partial<Record<SettingsKeys, boolean>>>
  playAudio: (key: keyof typeof audios) => Promise<HTMLAudioElement | null>
  offer: number
  setOffer: React.Dispatch<number>
  showOffer: boolean
  setShowOffer: React.Dispatch<boolean>
  showJackpot: boolean
  setShowJackpot: React.Dispatch<boolean>
  showClick: boolean
  setShowClick: React.Dispatch<boolean>
  jackpot: number
  disabled: boolean
  setDisabled: React.Dispatch<boolean>
  game: {
    next: () => void
    gameOver: () => void
    newGame: () => void
    deal: () => void
    winGame: () => void
  }
  mouseClick: (callback?: () => void | Promise<void>) => Promise<void>
  revolverRefHandle: React.RefObject<{
    spin: (interval: number) => Promise<void>
  }>
}

export const AppContext = React.createContext<ContextAppValue | null>(null)
