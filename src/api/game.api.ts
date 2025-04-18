import axios from 'axios'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'

import { api, ROUTE_PREFIX, QUERY_KEYS } from '@/api/api'
import { ROUTES } from '@/routes/path'
import {
  acceptOfferSchema,
  AcceptOfferSchema,
  gameListSchema,
  GameListSchema,
  gameSchema,
  GameSchema,
  pullGameSchema,
  PullGameSchema,
  StartGameSchema,
  startGameSchema,
} from '@/lib/schemas/game.schema'

export type Offer = {
  id: string
  amount: string
}

interface StartGamePayload {
  betAmount: string
}

interface StartGameResponse {
  betAmount: string
  coin: unknown
  gameId: string
  multiplier: number
  network: unknown
  potentialWin: string
  status: string
  success: boolean
}

interface PullGameResponse {
  gameStatus: string
  message: string
  offer: Offer | null
  pullAttempt: unknown[]
  position: number
  remainingPulls: number
  success: boolean
}

interface AcceptOfferResponse {
  gameStatus: string
  message: string
  offerAmount: string
  success: boolean
}

interface GameDetailsResponse extends GameSchema {}

interface AllGamesResponse extends GameListSchema {}

const prefix = ROUTE_PREFIX.game

const routes = {
  start: `/${prefix}/start`,
  pull: (gameId: string) => `/${prefix}/${gameId}/pull`,
  acceptOffer: (offerId: string) => `/${prefix}/offer/${offerId}/accept`,
  details: (gameId: string) => `/${prefix}/${gameId}`,
  all: `/${prefix}/all`,
} as const

export const startGame = async (
  payload: StartGamePayload,
): Promise<StartGameSchema> => {
  const { data } = await api.post<StartGameResponse>(routes.start, payload)
  return startGameSchema.parse(data)
}

export const pullGame = async (gameId: string): Promise<PullGameSchema> => {
  const { data } = await api.post<PullGameResponse>(routes.pull(gameId))
  return pullGameSchema.parse(data)
}

export const acceptOffer = async (
  offerId: string,
): Promise<AcceptOfferSchema> => {
  const { data } = await api.post<AcceptOfferResponse>(
    routes.acceptOffer(offerId),
  )
  return acceptOfferSchema.parse(data)
}

export const fetchGameDetails = async (gameId: string): Promise<GameSchema> => {
  const { data } = await api.get<GameDetailsResponse>(routes.details(gameId))
  return gameSchema.parse(data)
}

export const fetchAllGames = async (): Promise<GameListSchema> => {
  const { data } = await api.get<AllGamesResponse>(routes.all)
  return gameListSchema.parse(data)
}

export const useAllGames = () =>
  useQuery({
    queryKey: [QUERY_KEYS.allGames],
    queryFn: fetchAllGames,
  })

export const useGameDetails = (enabled: boolean) => {
  const { gameId } = useParams<{ gameId: string }>()

  return useQuery({
    enabled: enabled && Boolean(gameId),
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
        navigate(ROUTES.solo.game(gameId), { preventScrollReset: true })
      }
    },
  })
}

export const usePullGame = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: pullGame,
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        if (error.response.data.message.includes('Game is not active')) {
          navigate(ROUTES.solo.play)
        }
      }
    },
  })
}

export const useAcceptOffer = () =>
  useMutation({
    mutationFn: acceptOffer,
  })
