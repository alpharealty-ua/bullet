import React from 'react'

import { FormatGame, State } from '@/lib/constants'
import { GunHandle } from '@/components/revolver'

interface ContextAppValue {
  state: State
  changeState: React.Dispatch<State>
  countBullet: number
  bet: number
  setBet: React.Dispatch<number>
  activeMultiplierIndex: number
  characterIndex: number
  setCharacterIndex: React.Dispatch<number>
  offer: number
  next: (format: FormatGame, gameId?: string) => Promise<void>
  deal: () => Promise<void>
  revolverRefHandle: React.RefObject<GunHandle>
}

export const AppContext = React.createContext<ContextAppValue | null>(null)
