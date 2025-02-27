import axios from 'axios'

import { getToken } from '@/lib/localstorage'
import { ENV } from '@/lib/env'

const { API_URL } = ENV

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

api.interceptors.request.use((response) => {
  const token = getToken()
  response.headers.Authorization = `Bearer ${token}`
  return response
})
