import { useQuery } from '@tanstack/react-query'

import { api, QUERY_KEYS, SVC } from '@/api/api'

const svc = SVC.leaderboard

const routes = {
  gameStats: `${svc}/leaderboard/game-stats`,
  playerStatistics: `${svc}/statistics/player`,
} as const

export interface GetStatsResponse {
  topPlayers: {
    rank: number
    username: string
    lvl: number
    precision: number
    consistency: number
    speed: number
    region: string
    wins: number
    losses: number
    winRate: number
  }[]
  levelDistribution: {
    range: string
    count: number
    color: string
    percentage: number
  }[]
  regions: {
    name: string
    count: number
    percentage: number
  }[]
  milestones: {
    lvl: number
    rank: number
    percentile: number
  }[]
  totalPlayers: number
}

export interface PlayerStatisticsResponse {
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
): Promise<PlayerStatisticsResponse> => {
  const { data } = await api.get<PlayerStatisticsResponse>(
    `${routes.playerStatistics}/${playerId}`,
  )
  return data
}

export const useGameStats = () =>
  useQuery({
    queryKey: [QUERY_KEYS.gameStats],
    queryFn: fetchGameStats,
  })

export const usePlayerStatistics = (playerId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.playerStatistics],
    queryFn: () => fetchPlayerStatistics(playerId),
  })
