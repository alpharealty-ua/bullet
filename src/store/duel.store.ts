import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Winner } from '@/socket/duel/duel-socket.types'
import { CharacterName } from '@/lib/constants'

interface DuelState {
  round: number
  winner: Winner | null
  pullTriggerPromise: Promise<void>
  resultPromise: Promise<void>
  isLeftOpponent: boolean
  isDisconnectedOpponent: boolean
  isGameEnded: boolean
  isRematchCreated: boolean
  leaveGameCalled: boolean
  canPull: boolean
  pulls: number[]
  characterName: CharacterName
  setCharacterName: (characterName: CharacterName) => void
}

const useDuelStore = create<DuelState>()(
  persist(
    (set) => ({
      round: 1,
      winner: null,
      pullTriggerPromise: Promise.resolve(),
      resultPromise: Promise.resolve(),
      isLeftOpponent: false,
      isDisconnectedOpponent: false,
      isGameEnded: false,
      isRematchCreated: false,
      leaveGameCalled: false,
      canPull: true,
      pulls: [],
      characterName: 'nubcat',
      setCharacterName: (characterName: CharacterName) =>
        set({ characterName }),
    }),
    {
      name: 'game-storage',
    },
  ),
)

export { useDuelStore }
