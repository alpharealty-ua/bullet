import { z } from 'zod'

const recentGameSchema = z.object({
  gameId: z.string(),
  gameMode: z.string(),
  date: z.string(),
  result: z.string(),
  score: z.number(),
  opponentScore: z.number(),
  opponentUsername: z.string(),
})

const performanceTrendSchema = z.object({
  date: z.string(),
  lvl: z.number(),
})

export const playerStatisticsSchema = z.object({
  userId: z.string(),
  username: z.string(),
  country: z.string(),
  lvl: z.number(),
  precision: z.number(),
  consistency: z.number(),
  speedAdapt: z.number(),
  rank: z.number(),
  percentile: z.number(),
  topPercent: z.number(),
  betterThan: z.number(),
  totalGames: z.number(),
  gamesWon: z.number(),
  gamesLost: z.number(),
  winRate: z.number(),
  gameMode: z.string(),
  perfectHitRate: z.number(),
  recentGames: z.array(recentGameSchema),
  performanceTrend: z.array(performanceTrendSchema),
})

export type PlayerStatisticsSchema = z.infer<typeof playerStatisticsSchema>
