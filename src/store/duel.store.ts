import { CharacterName } from '@/lib/constants'
import { create } from 'zustand'

type DuelState = {
  characterName: CharacterName
  setCharacterName: (characterName: CharacterName) => void
}

const useDuelStore = create<DuelState>()((set) => ({
  characterName: 'nubcat',
  setCharacterName: (characterName: CharacterName) => set({ characterName }),
}))

export { useDuelStore }
