import { useEffect } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { LoginSchema } from '@/lib/schemas/login.schema'
import { api } from '@/api/api'
import { QUERY_KEY } from '@/lib/constants'
import { getToken, saveToken } from '@/lib/localstorage'

interface ILoginResponse {
  accessToken: string
  user: User
}

export const login = async (values: LoginSchema) => {
  try {
    const { data } = await api.post<ILoginResponse>('auth/login', values)
    return data
  } catch (e) {
    if (axios.isAxiosError(e) && e.response && e.response.data) {
      throw new Error(e.response.data.message)
    }
    throw e
  }
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken }) => {
      saveToken(accessToken)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export const fetchProfile = async (): Promise<User | null> => {
  const accessToken = getToken()

  if (!accessToken) {
    return null
  }

  const { data, status } = await api.get<User>('/auth/profile')

  if (!(status === 200)) {
    throw new Error('Failed on get user request')
  }

  return data
}

export const useUser = () => {
  const { data: user, isError } = useQuery({
    queryKey: [QUERY_KEY.profile],
    queryFn: fetchProfile,
  })

  useEffect(() => {
    isError
  })

  return user ?? null
}
