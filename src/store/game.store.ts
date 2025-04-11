import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { MatchDetails } from '@/socket/matchmaker/matchmaker-soket.types'
import { CharacterName } from '@/lib/constants'

interface GameState {
  increaseTime: number | undefined
  characterName: CharacterName
  matchDetails: MatchDetails | null
  setIncreaseTime: (increaseTime: number | undefined) => void
  setCharacterName: (characterName: CharacterName) => void
  setMatchDetails: (matchDetails: MatchDetails | null) => void
}

const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      characterName: 'nubcat',
      increaseTime: undefined,
      matchDetails: null,
      setIncreaseTime: (increaseTime: number | undefined) =>
        set({ increaseTime }),
      setCharacterName: (characterName: CharacterName) =>
        set({ characterName }),
      setMatchDetails: (matchDetails: MatchDetails | null) =>
        set({ matchDetails }),
    }),
    { name: 'game-storage' },
  ),
)

export { useGameStore }
