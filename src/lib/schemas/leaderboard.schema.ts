import { z } from 'zod'

const topPlayerSchema = z.object({
  rank: z.number(),
  // TODO: BACKEND. REMOVE NULLISH
  flag: z.string().nullish(),
  username: z.string(),
  lvl: z.number(),
  precision: z.number(),
  consistency: z.number(),
  speed: z.number(),
  // TODO: BACKEND. REMOVE NULLISH
  perfectHitPercent: z.number().nullish(),
  region: z.string(),
  wins: z.number(),
  losses: z.number(),
  winRate: z.number(),
})

const topPlayerListSchema = z.array(topPlayerSchema)

export type TopPlayerListSchema = z.infer<typeof topPlayerListSchema>

const risingStarSchema = z.object({
  rank: z.number(),
  displayRank: z.string(),
  flag: z.string(),
  name: z.string(),
  region: z.string(),
  lvl: z.number(),
  precision: z.number(),
  speed: z.number(),
  perfectHitPercent: z.number(),
  wins: z.number(),
  losses: z.number(),
  totalGames: z.number(),
})

const risingStarListSchema = z.array(risingStarSchema)

export type RisingStarListchema = z.infer<typeof risingStarListSchema>

const regionalChampionSchema = z.object({
  region: z.string(),
  flag: z.string(),
  name: z.string(),
  rank: z.number(),
  lvl: z.number(),
  precision: z.number(),
  speed: z.number(),
  perfectHitPercent: z.number(),
  wins: z.number(),
  losses: z.number(),
})

const regionalChampionListSchema = z.array(regionalChampionSchema)

export type RegionalChampionListchema = z.infer<
  typeof regionalChampionListSchema
>

const levelDistributionSchema = z.object({
  range: z.string(),
  count: z.number(),
  color: z.string(),
  percentage: z.number(),
})

const levelDistributionListSchema = z.array(levelDistributionSchema)

export type LevelDistributionListSchema = z.infer<
  typeof levelDistributionListSchema
>

const regionSchema = z.object({
  name: z.string(),
  count: z.number(),
  percentage: z.number(),
})

const regionSchemaListSchema = z.array(regionSchema)

export type RegionSchemaListSchema = z.infer<typeof regionSchemaListSchema>

const milistoneSchema = z.object({
  lvl: z.number(),
  rank: z.number(),
  percentile: z.number(),
})

const milistoneSchemaListSchema = z.array(milistoneSchema)

export type MilistoneSchemaListSchema = z.infer<
  typeof milistoneSchemaListSchema
>

export const getStatsResponseSchema = z.object({
  topPlayers: topPlayerListSchema,
  risingStars: risingStarListSchema,
  regionalChampions: regionalChampionListSchema,
  levelDistribution: levelDistributionListSchema,
  regions: regionSchemaListSchema,
  milestones: milistoneSchemaListSchema,
  totalPlayers: z.number(),
})

export type GetStatsResponseSchema = z.infer<typeof getStatsResponseSchema>

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

export const getPlayerStatistics = (statistics: PlayerStatisticsSchema) => [
  {
    label: 'Total games',
    value: statistics.totalGames,
  },
  {
    label: 'Win rate',
    value: statistics.winRate,
  },
  {
    label: 'Lvl',
    value: statistics.lvl,
  },
  {
    label: 'Percentile',
    value: statistics.percentile,
  },
  {
    label: 'Perfect Shot',
    value: statistics.perfectHitRate,
  },
]
