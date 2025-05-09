import { create } from 'zustand'

import { Offer } from '@/api/game.api'
import { OfferSchema } from '@/lib/schemas/game.schema'

interface SoloState {
  countBullet: number
  bet: number
  jackpot: number
  multiplier: number
  offer: OfferSchema | null
  setCountBullet: (countBullet: number) => void
  setBet: (bet: number) => void
  setJackpot: (jackpot: number) => void
  setMultiplier: (multiplier: number) => void
  setOffer: (offer: OfferSchema | null) => void
}

const useSoloStore = create<SoloState>()((set) => ({
  countBullet: 5,
  bet: 0,
  jackpot: -1,
  multiplier: -1,
  offer: null,
  setCountBullet: (countBullet: number) => set({ countBullet }),
  setBet: (bet: number) => set({ bet }),
  setJackpot: (jackpot: number) => set({ jackpot }),
  setMultiplier: (multiplier: number) => set({ multiplier }),
  setOffer: (offer: Offer | null) => set({ offer }),
}))

export { useSoloStore }
