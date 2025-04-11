import { useQuery } from '@tanstack/react-query'

import { api, QUERY_KEYS } from '@/api/api'

const routes = {
  gameStats: '/leaderboard/leaderboard/game-stats',
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

export const fetchGameStats = async (): Promise<GetStatsResponse> => {
  const { data } = await api.get<GetStatsResponse>(routes.gameStats)
  return data
}

export const useGameStats = () =>
  useQuery({
    queryKey: [QUERY_KEYS.gameStats],
    queryFn: fetchGameStats,
  })
