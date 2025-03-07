import { create } from 'zustand'

import { StateGame } from '@/lib/constants'

type SoloState = {
  state: StateGame
  multiplierIndex: number
  multiplier: number
  prevState: StateGame
  isStartedGame: boolean
  noMoney: boolean
  jackpot: number
  bet: number
  maxBet: number
  countBullet: number
  offer: number
  increaseTime: number | undefined
  setState: (state: StateGame) => void
  setMultiplierIndex: (multiplierIndex: number) => void
  setMultiplier: (multiplier: number) => void
  setIsStartedGame: (isStartedGame: boolean) => void
  setNoMoney: (noMoney: boolean) => void
  setJackpot: (jackpot: number) => void
  setBet: (setBet: number) => void
  setMaxBet: (setBet: number) => void
  setCountBullet: (setBet: number) => void
  setOffer: (offer: number) => void
  setIncreaseTime: (increaseTime: number | undefined) => void
  newGame: (balance: number) => void
}

const useSoloStore = create<SoloState>()((set, get) => ({
  state: 'preparation',
  prevState: 'preparation',
  multiplierIndex: -1,
  multiplier: 0,
  isStartedGame: false,
  noMoney: false,
  jackpot: 0,
  bet: 0,
  maxBet: 0,
  countBullet: 5,
  offer: 0,
  increaseTime: undefined,
  setState: (state: StateGame) => set({ state }),
  setMultiplierIndex: (multiplierIndex: number) => set({ multiplierIndex }),
  setMultiplier: (multiplier: number) => set({ multiplier }),
  setIsStartedGame: (isStartedGame: boolean) => set({ isStartedGame }),
  setNoMoney: (noMoney: boolean) => set({ noMoney }),
  setJackpot: (jackpot: number) => set({ jackpot }),
  setBet: (bet: number) => set({ bet }),
  setMaxBet: (maxBet: number) => set({ maxBet }),
  setCountBullet: (countBullet: number) => set({ countBullet }),
  setOffer: (offer: number) => set({ offer }),
  setIncreaseTime: (increaseTime: number | undefined) => set({ increaseTime }),
  newGame: (balance: number) => {
    const {
      setState,
      setBet,
      setOffer,
      setCountBullet,
      setMultiplierIndex,
      setMultiplier,
      bet,
    } = get()

    const hasPrevBet = bet !== 0
    const prevBet = hasPrevBet ? (bet > balance ? balance : bet) : 0

    setState('preparation')
    setBet(prevBet)
    setOffer(0)
    setCountBullet(5)
    setMultiplierIndex(-1)
    setMultiplier(0)
  },
}))

export { useSoloStore }
