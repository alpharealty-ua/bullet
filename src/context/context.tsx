import React from 'react'

import { FormatGame, StateGame } from '@/lib/constants'
import { GunHandle } from '@/components/revolver'

interface ContextAppValue {
  state: StateGame
  changeState: React.Dispatch<StateGame>
  characterIndex: number
  setCharacterIndex: React.Dispatch<number>
  offer: number
  next: (format: FormatGame, gameId?: string) => Promise<void>
  deal: () => Promise<void>
  revolverRefHandle: React.RefObject<GunHandle>
}

export const AppContext = React.createContext<ContextAppValue | null>(null)
