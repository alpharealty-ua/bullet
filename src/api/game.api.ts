import axios from 'axios'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'

import { api, ROUTE_PREFIX, QUERY_KEYS } from '@/api/api'
import { ROUTES } from '@/routes/path'
import {
  gameListSchema,
  GameListSchema,
  gameSchema,
  GameSchema,
  GameStatusSchema,
} from '@/lib/schemas/game.schema'

// TODO: ADD SCHEMA TO ALL RESPONSE
export type Offer = {
  id: string
  amount: string
}

interface StartGamePayload {
  betAmount: string
}

interface StartGameResponse {
  gameId: string
  multiplier: string
}

interface GamePullResponse {
  success: boolean
  position: number
  offer: Offer | null
  gameStatus: GameStatusSchema
  remainingPulls: number
}

interface AcceptOfferResponse {
  success: boolean
  position: number
  offer: Offer | null
  gameStatus: GameStatusSchema
  remainingPulls: number
}

interface GameDetailsResponse extends GameSchema {}

type AllGamesResponse = GameListSchema

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
): Promise<StartGameResponse> => {
  const { data } = await api.post<StartGameResponse>(routes.start, payload)
  return data
}

export const gamePull = async (gameId: string): Promise<GamePullResponse> => {
  const { data } = await api.post<GamePullResponse>(routes.pull(gameId))
  return data
}

export const acceptOffer = async (
  offerId: string,
): Promise<AcceptOfferResponse> => {
  const { data } = await api.post<AcceptOfferResponse>(
    routes.acceptOffer(offerId),
  )
  return data
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

export const useGamePull = () =>
  useMutation({
    mutationFn: gamePull,
  })

export const useAcceptOffer = () =>
  useMutation({
    mutationFn: acceptOffer,
  })
