import React from 'react'

import { audios, FormatGame, SettingsKeys, State } from '@/lib/constants'

interface ContextAppValue {
  state: State
  changeState: React.Dispatch<State>
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
  characterIndex: number
  setCharacterIndex: React.Dispatch<number>
  playAudio: (
    key: keyof typeof audios,
    play?: boolean,
  ) => Promise<HTMLAudioElement>
  offer: number
  showOffer: boolean
  showJackpot: boolean
  showClick: boolean
  jackpot: number
  game: {
    next: (format: FormatGame) => Promise<void>
    newGame: () => Promise<void>
    deal: () => Promise<void>
  }
  revolverRefHandle: React.RefObject<{
    spin: (duration?: number) => Promise<void>
  }>
}

export const AppContext = React.createContext<ContextAppValue | null>(null)
