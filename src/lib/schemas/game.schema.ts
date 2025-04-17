import { z } from 'zod'

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

export const gameListSchema = z.array(gameSchema)

export type GameStatusSchema = z.infer<typeof gameStatusSchema>

export type GameSchema = z.infer<typeof gameSchema>

export type GameListSchema = z.infer<typeof gameListSchema>
