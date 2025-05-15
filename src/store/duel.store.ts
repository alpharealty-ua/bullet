import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { CharacterName } from '@/lib/constants'

interface DuelState {
  characterName: CharacterName
  setCharacterName: (characterName: CharacterName) => void
}

const useDuelStore = create<DuelState>()(
  persist(
    (set) => ({
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
