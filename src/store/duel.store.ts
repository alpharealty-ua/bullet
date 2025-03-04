import { CharacterName } from '@/lib/constants'
import { create } from 'zustand'

type DuelState = {
  characterName: CharacterName
  round: number
  setCharacterName: (characterName: CharacterName) => void
  setRound: (round: number) => void
  addRound: () => void
}

const useDuelStore = create<DuelState>()((set, get) => ({
  characterName: 'nubcat',
  round: 1,
  setCharacterName: (characterName: CharacterName) => set({ characterName }),
  setRound: (round: number) => set({ round }),
  addRound: () => set({ round: get().round + 1 }),
}))

export { useDuelStore }
