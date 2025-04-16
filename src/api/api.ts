import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'

import { refreshToken as refreshTokenRequest } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { ENV } from '@/lib/env'

const { API_URL } = ENV

// TODO: ADD PREFIX TO ALL ROUTES
export const SVC = {
  leaderboard: 'leaderboard',
  character: 'character',
} as const

export const QUERY_KEYS = {
  profile: 'profile',
  balance: 'balance',
  allGames: 'allGames',
  gameDetails: 'gameDetails',
  gameStats: 'gameStats',
  playerStatistics: 'playerStatistics',
  userCharacters: 'userCharacters',
  characters: 'characters',
  userOffers: 'userOffers',
} as const

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
})

api.interceptors.request.use(async (request) => {
  const token = useAuthStore.getState().accessToken

  if (token) {
    request.headers.Authorization = `Bearer ${token}`
  }

  return request
})

api.interceptors.response.use(
  undefined,
  async (error: AxiosError<{ message: string }>) => {
    const isUnauthorized = error.status === 401 || error.status === 403

    if (isUnauthorized) {
      const accessToken = useAuthStore.getState().accessToken
      const refreshToken = useAuthStore.getState().refreshToken

      const originalRequest = error.config as typeof error.config & {
        _retry?: boolean
      }
      const isRetryRequest = originalRequest._retry
      originalRequest._retry = true
      const isRefreshRequest = originalRequest.url?.includes(
        '/auth/refresh-token',
      )

      if (refreshToken === null || isRetryRequest) {
        useAuthStore.getState().resetTokens()
        throw error
      }

      if (isRefreshRequest) {
        if (originalRequest.data.refreshToken === refreshToken) {
          throw error
        }
        return { data: { accessToken, refreshToken } }
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await refreshTokenRequest({
          refreshToken: refreshToken,
        })

      useAuthStore.getState().setTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })

      return api(originalRequest)
    }
    if (error.response && error.response.data) {
      error.message = error.response.data.message
      !import.meta.env.PROD && toast.error(error.message)
    }
    throw error
  },
)
