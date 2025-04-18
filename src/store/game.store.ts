import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { MatchDetails } from '@/socket/matchmaker/matchmaker-soket.types'
import { CharacterName } from '@/lib/constants'

interface GameState {
  increaseTime: number
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
      increaseTime: 500,
      matchDetails: null,
      setIncreaseTime: (increaseTime: number | undefined) =>
        set({ increaseTime: increaseTime ?? 500 }),
      setCharacterName: (characterName: CharacterName) =>
        set({ characterName }),
      setMatchDetails: (matchDetails: MatchDetails | null) =>
        set({ matchDetails }),
    }),
    { name: 'game-storage' },
  ),
)

export { useGameStore }
