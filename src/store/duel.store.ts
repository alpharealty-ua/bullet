import { create } from 'zustand'

type DuelState = {
  characterIndex: number
  setCharacterIndex: (characterIndex: number) => void
}

const useDuelStore = create<DuelState>()((set) => ({
  characterIndex: 0,
  setCharacterIndex: (characterIndex: number) => set({ characterIndex }),
}))

export { useDuelStore }
