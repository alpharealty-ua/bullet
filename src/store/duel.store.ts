import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { MatchDetails } from '@/socket/matchmaker/matchmaker-soket.types'
import { CharacterName } from '@/lib/constants'

interface DuelState {
  characterName: CharacterName
  matchDetails: MatchDetails | null
  setCharacterName: (characterName: CharacterName) => void
  setMatchDetails: (matchDetails: MatchDetails | null) => void
}

const useDuelStore = create<DuelState>()(
  persist(
    (set) => ({
      characterName: 'nubcat',
      matchDetails: null,
      setCharacterName: (characterName: CharacterName) =>
        set({ characterName }),
      setMatchDetails: (matchDetails: MatchDetails | null) =>
        set({ matchDetails }),
    }),
    {
      name: 'game-storage',
    },
  ),
)

export { useDuelStore }
