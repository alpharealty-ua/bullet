import { z } from 'zod'

const offerSchema = z.object({
  id: z.string(),
  amount: z.string(),
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
  formattedBetAmount: z.number(),
  formattedPotentialWin: z.number(),
  formattedActualWin: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type GameSchema = z.infer<typeof gameSchema>

export const gameListSchema = z.array(gameSchema)

export type GameListSchema = z.infer<typeof gameListSchema>

export const startGameSchema = z.object({
  gameId: z.string(),
  multiplier: z.string(),
})

export type StartGameSchema = z.infer<typeof startGameSchema>

export const pullGameSchema = z.object({
  success: z.boolean(),
  position: z.number(),
  offer: offerSchema.nullable(),
  gameStatus: z.string(),
  remainingPulls: z.number(),
})

export type PullGameSchema = z.infer<typeof pullGameSchema>

export const acceptOfferSchema = pullGameSchema

export type AcceptOfferSchema = z.infer<typeof acceptOfferSchema>
