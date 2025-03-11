import { CharacterName } from '@/lib/constants'
import { create } from 'zustand'

// TODO: CHANGE TO INTERFACE
type DuelState = {
  characterName: CharacterName
  round: number
  setCharacterName: (characterName: CharacterName) => void
  setRound: (round: number) => void
  addRound: () => void
  newGame: () => void
}

const useDuelStore = create<DuelState>()((set, get) => ({
  characterName: 'nubcat',
  round: 1,
  setCharacterName: (characterName: CharacterName) => set({ characterName }),
  setRound: (round: number) => set({ round }),
  addRound: () => set({ round: get().round + 1 }),
  newGame: () => {
    const { setRound } = get()

    setRound(1)
  },
}))

export { useDuelStore }
