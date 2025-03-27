import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Offer } from '@/api/game.api'
import { CharacterName, StateGame } from '@/lib/constants'

interface GameState {
  state: StateGame
  balance: number
  multiplier: number
  prevState: StateGame
  isStartedGame: boolean
  noMoney: boolean
  jackpot: number
  bet: number
  maxBet: number
  countBullet: number
  offer: Offer | null
  increaseTime: number | undefined
  characterName: CharacterName
  round: number
  pullRound: number[]
  playerId: string | null
  gameId: string | null
  setState: (state: StateGame) => void
  setBalance: (balance: number) => void
  setMultiplier: (multiplier: number) => void
  setIsStartedGame: (isStartedGame: boolean) => void
  setNoMoney: (noMoney: boolean) => void
  setJackpot: (jackpot: number) => void
  setBet: (setBet: number) => void
  setMaxBet: (setBet: number) => void
  setCountBullet: (setBet: number) => void
  setOffer: (offer: Offer | null) => void
  setIncreaseTime: (increaseTime: number | undefined) => void
  setCharacterName: (characterName: CharacterName) => void
  setRound: (round: number) => void
  addRound: () => void
  addPullRound: () => void
  setPullRound: (pullRound: number[]) => void
  setPlayerId: (playerId: string | null) => void
  setGameId: (playerId: string | null) => void
  newGame: () => void
}

const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      state: 'preparation',
      prevState: 'preparation',
      balance: 0,
      characterName: 'nubcat',
      round: 1,
      multiplier: 0,
      isStartedGame: false,
      noMoney: false,
      jackpot: 0,
      bet: 0,
      maxBet: 0,
      countBullet: 5,
      offer: null,
      increaseTime: undefined,
      pullRound: [],
      gameId: null,
      playerId: null,
      setState: (state: StateGame) => set({ state }),
      setBalance: (balance: number) => set({ balance }),
      setMultiplier: (multiplier: number) => set({ multiplier }),
      setIsStartedGame: (isStartedGame: boolean) => set({ isStartedGame }),
      setNoMoney: (noMoney: boolean) => set({ noMoney }),
      setJackpot: (jackpot: number) => set({ jackpot }),
      setBet: (bet: number) => set({ bet }),
      setMaxBet: (maxBet: number) => set({ maxBet }),
      setCountBullet: (countBullet: number) => set({ countBullet }),
      setOffer: (offer: Offer | null) => set({ offer }),
      setIncreaseTime: (increaseTime: number | undefined) =>
        set({ increaseTime }),
      setCharacterName: (characterName: CharacterName) =>
        set({ characterName }),
      setRound: (round: number) => set({ round }),
      addRound: () => set({ round: get().round + 1 }),
      addPullRound: () => set({ pullRound: [...get().pullRound, get().round] }),
      setPullRound: (pullRound: number[]) => set({ pullRound }),
      setGameId: (gameId: string | null) => set({ gameId }),
      setPlayerId: (playerId: string | null) => set({ playerId }),
      newGame: () => {
        const {
          setState,
          setJackpot,
          setBet,
          setOffer,
          setCountBullet,
          setMultiplier,
          setRound,
          setPullRound,
          bet,
          balance,
        } = get()

        const hasPrevBet = bet !== 0
        const prevBet = hasPrevBet ? (bet > balance ? balance : bet) : 0

        setState('preparation')
        setJackpot(0)
        setBet(prevBet)
        setOffer(null)
        setCountBullet(5)
        setMultiplier(0)
        setRound(1)
        setPullRound([])
      },
    }),
    { name: 'game-storage' },
  ),
)

export { useGameStore }
