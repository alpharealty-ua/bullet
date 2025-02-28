import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { LoginSchema } from '@/lib/schemas/login.schema'
import { api } from '@/api/api'
import { QUERY_KEY } from '@/lib/constants'
import { getToken, saveToken } from '@/lib/localstorage'

interface ILoginResponse {
  accessToken: string
  user: User
}

export const login = async (values: LoginSchema): Promise<ILoginResponse> => {
  const { data } = await api.post<ILoginResponse>('auth/login', values)
  saveToken(data.accessToken)
  return data
}

export const fetchProfile = async (): Promise<User | null> => {
  const { data } = await api.get<User>('/auth/profile')
  return data
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useProfile = () =>
  useQuery({
    enabled: Boolean(getToken()),
    queryKey: [QUERY_KEY.profile],
    queryFn: fetchProfile,
  })
