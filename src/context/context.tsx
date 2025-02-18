import React from 'react'

import { audios, FormatGame, SettingsKeys, State } from '@/lib/constants'

interface ContextAppValue {
  state: State
  changeState: React.Dispatch<State>
  format: FormatGame
  rank: number
  countBullet: number
  balance: number
  addBalance: React.Dispatch<number>
  bet: number
  setBet: React.Dispatch<number>
  activeMultiplierIndex: number
  showHelpers: boolean
  settings: Record<SettingsKeys, boolean>
  changeSettings: React.Dispatch<Partial<Record<SettingsKeys, boolean>>>
  playAudio: (key: keyof typeof audios) => Promise<HTMLAudioElement | null>
  offer: number
  showOffer: boolean
  showJackpot: boolean
  showClick: boolean
  jackpot: number
  disabled: boolean
  game: {
    next: () => void
    gameOver: () => void
    newGame: (format?: FormatGame) => void
    deal: () => void
    winGame: () => void
  }
  gameOverImage: string
  // TODO: MOVE TO BUTTON COMPONENT
  mouseClick: (callback?: () => void | Promise<void>) => Promise<void>
  revolverRefHandle: React.RefObject<{
    spin: (interval: number) => Promise<void>
  }>
}

export const AppContext = React.createContext<ContextAppValue | null>(null)
