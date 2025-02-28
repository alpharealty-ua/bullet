import axios from 'axios'

import { getToken, removeToken } from '@/lib/localstorage'
import { ENV } from '@/lib/env'

const { API_URL } = ENV

export const QUERY_KEYS = {
  profile: 'profile',
  balance: 'balance',
} as const

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
})

api.interceptors.request.use((request) => {
  const token = getToken()
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
    removeToken()
  }
  if (axios.isAxiosError(error) && error.response && error.response.data) {
    error.message = error.response.data.message
  }
  throw error
})
