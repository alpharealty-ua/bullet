import axios from 'axios'

import { getToken } from '@/lib/localstorage'
import { ENV } from '@/lib/env'

const { API_URL } = ENV

export const api = axios.create({
  // @ts-ignore
  // eslint-disable-next-line
  baseURL: API_URL,
  withCredentials: true,
})

api.interceptors.request.use((request) => {
  const token = getToken()
  request.headers.Authorization = `Bearer ${token}`
  return request
})

api.interceptors.response.use(undefined, (error: unknown) => {
  if (axios.isAxiosError(error) && error.response && error.response.data) {
    error.message = error.response.data.message
  }
  throw error
})
