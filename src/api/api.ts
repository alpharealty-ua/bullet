import axios from 'axios'
import { toast } from 'react-toastify'

import { useAuthStore } from '@/store/auth.store'
import { ENV } from '@/lib/env'

const { API_URL } = ENV

export const QUERY_KEYS = {
  profile: 'profile',
  balance: 'balance',
  allGames: 'allGames',
  gameDetails: 'gameDetails',
} as const

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
})

api.interceptors.request.use((request) => {
  const token = useAuthStore.getState().token
  if (token) {
    request.headers.Authorization = `Bearer ${token}`
  }
  return request
})

api.interceptors.response.use(undefined, (error: unknown) => {
  if (
    axios.isAxiosError(error) &&
    (error.status === 401 || error.status === 403) &&
    error.config?.url === '/auth/profile'
  ) {
    useAuthStore.getState().resetToken()
  }
  if (axios.isAxiosError(error) && error.response && error.response.data) {
    error.message = error.response.data.message
    toast.error(error.message)
  }
  throw error
})
