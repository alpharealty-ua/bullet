import { useQuery } from '@tanstack/react-query'

import { api, QUERY_KEYS, ROUTE_PREFIX } from '@/api/api'
import { useUser } from '@/api/auth.api'
import {
  playerStatisticsSchema,
  PlayerStatisticsSchema,
} from '@/lib/schemas/leadboard.schema'

const prefix = ROUTE_PREFIX.leaderboard

const routes = {
  gameStats: `${prefix}/leaderboard/game-stats`,
  playerStatistics: `${prefix}/statistics/player`,
} as const

export interface GetStatsResponse {
  topPlayers: TopPlayer[]
  risingStars: RisingStar[]
  regionalChampions: RegionalChampion[]
  levelDistribution: LevelDistribution[]
  regions: Region[]
  milestones: Milistone[]
  totalPlayers: number
}

interface TopPlayer {
  rank: number
  flag: string
  username: string
  lvl: number
  precision: number
  consistency: number
  speed: number
  perfectHitPercent: number
  region: string
  wins: number
  losses: number
  winRate: number
}

interface RisingStar {
  rank: number
  displayRank: string
  flag: string
  name: string
  region: string
  lvl: number
  precision: number
  speed: number
  perfectHitPercent: number
  wins: number
  losses: number
  totalGames: number
}

interface RegionalChampion {
  region: string
  flag: string
  name: string
  rank: number
  lvl: number
  precision: number
  speed: number
  perfectHitPercent: number
  wins: number
  losses: number
}

interface LevelDistribution {
  range: string
  count: number
  color: string
  percentage: number
}

interface Region {
  name: string
  count: number
  percentage: number
}

interface Milistone {
  lvl: number
  rank: number
  percentile: number
}

interface PlayerStatisticsResponse {
  userId: string
  username: string
  country: string
  lvl: number
  precision: number
  consistency: number
  speedAdapt: number
  rank: number
  percentile: number
  topPercent: number
  betterThan: number
  totalGames: number
  gamesWon: number
  gamesLost: number
  winRate: number
  gameMode: string
  perfectHitRate: number
  recentGames: RecentGame[]
  performanceTrend: PerformanceTrend[]
}

interface RecentGame {
  gameId: string
  gameMode: string
  date: string
  result: string
  score: number
  opponentScore: number
  opponentUsername: string
}

interface PerformanceTrend {
  date: string
  lvl: number
}

export const fetchGameStats = async (): Promise<GetStatsResponse> => {
  const { data } = await api.get<GetStatsResponse>(routes.gameStats)
  return data
}

export const fetchPlayerStatistics = async (
  playerId: string,
): Promise<PlayerStatisticsSchema> => {
  const { data } = await api.get<PlayerStatisticsResponse>(
    `${routes.playerStatistics}/${playerId}`,
  )

  return playerStatisticsSchema.parse(data)
}

export const useGameStats = () =>
  useQuery({
    queryKey: [QUERY_KEYS.gameStats],
    queryFn: fetchGameStats,
  })

export const usePlayerStatistics = (playerId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.playerStatistics, playerId],
    queryFn: () => fetchPlayerStatistics(playerId),
  })

export const useUserStatistics = () => {
  const { id } = useUser()

  return usePlayerStatistics(id)
}
