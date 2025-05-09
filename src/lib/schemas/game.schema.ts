import { z } from 'zod'

import { coinSchema, networkSchema } from '@/lib/schemas/wallet.schema'

const offerSchema = z.object({
  id: z.string(),
  gameId: z.string(),
  networkId: z.string(),
  coinId: z.string(),
  decimals: z.number(),
  amount: z.string(),
  multiplier: z.number(),
  status: z.string(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
})

const gameStatusSchema = z.enum([
  'ACTIVE',
  'PENDING',
  'COMPLETED_LOSE',
  'COMPLETED_WIN',
  'COMPLETED_DEAL',
])

export const gameSchema = z.object({
  id: z.string(),
  status: gameStatusSchema,
  betAmount: z.string(),
  multiplier: z.number(),
  potentialWin: z.string(),
  actualWin: z.string().nullable(),
  currentPosition: z.number(),
  currentOffer: offerSchema.nullish(),
  formattedBetAmount: z.number(),
  formattedPotentialWin: z.number(),
  formattedActualWin: z.number().nullable(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
})

export type OfferSchema = z.infer<typeof offerSchema>

export type GameSchema = z.infer<typeof gameSchema>

export const gameListSchema = z.array(gameSchema)

export type GameListSchema = z.infer<typeof gameListSchema>

export const startGameSchema = z.object({
  betAmount: z.string(),
  coin: coinSchema,
  gameId: z.string(),
  multiplier: z.number(),
  network: networkSchema,
  potentialWin: z.string(),
  status: gameStatusSchema,
  success: z.boolean(),
})

export type StartGameSchema = z.infer<typeof startGameSchema>

export const pullGameSchema = z.object({
  gameStatus: z.string(),
  message: z.string(),
  offer: offerSchema.nullish(),
  position: z.number(),
  remainingPulls: z.number().nullish(),
  success: z.boolean(),
})

export type PullGameSchema = z.infer<typeof pullGameSchema>

export const acceptOfferSchema = z.object({
  gameStatus: z.string(),
  message: z.string(),
  offerAmount: z.string(),
  success: z.boolean(),
})

export type AcceptOfferSchema = z.infer<typeof acceptOfferSchema>
