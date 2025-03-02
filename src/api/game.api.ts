import axios from 'axios'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'

import { api, QUERY_KEYS } from '@/api/api'
import { ROUTES } from '@/routes/path'

interface StartGamePayload {
  betAmount: string
}

interface StartGameResponse {
  gameId: string
}

interface GamePullResponse {
  success: boolean
  position: number
  gameStatus: 'ACTIVE'
  remainingPulls: number
}

type Game = {
  id: string
  betAmount: string
  multiplier: string
  potentialWin: string
  currentPosition: string
  status: 'ACTIVE'
}

type GameDetailsResponse = Game
type AllGamesResponse = Game[]

const routes = {
  start: '/game/start',
  pull: (gameId: string) => `/game/${gameId}/pull`,
  details: (gameId: string) => `/game/${gameId}`,
  all: '/game/all',
} as const

export const startGame = async (
  payload: StartGamePayload,
): Promise<StartGameResponse> => {
  const { data } = await api.post<StartGameResponse>(routes.start, payload)
  return data
}

export const gamePull = async (gameId: string): Promise<GamePullResponse> => {
  const { data } = await api.post<GamePullResponse>(routes.pull(gameId))
  return data
}

export const fetchGameDetails = async (
  gameId: string,
): Promise<GameDetailsResponse> => {
  const { data } = await api.get<GameDetailsResponse>(routes.details(gameId))
  return data
}

export const fetchAllGames = async (): Promise<AllGamesResponse> => {
  const { data } = await api.get<AllGamesResponse>(routes.all)
  return data
}

export const useAllGames = () =>
  useQuery({
    queryKey: [QUERY_KEYS.allGames],
    queryFn: fetchAllGames,
  })

export const useGameDetails = () => {
  const { gameId } = useParams<{ gameId: string }>()

  return useQuery({
    enabled: Boolean(gameId),
    queryKey: [QUERY_KEYS.gameDetails],
    queryFn: () => fetchGameDetails(gameId!),
  })
}

export const useStartGame = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: startGame,
    onError: (error) => {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.gameId
      ) {
        const gameId = error.response.data.gameId
        navigate(`${ROUTES.solo.play}/${gameId}`)
      }
    },
  })
}

export const useGamePull = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: gamePull,
    onSuccess: () => {},
    onError: () => {
      navigate(ROUTES.solo.play)
    },
  })
}
