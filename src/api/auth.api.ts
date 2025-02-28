import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { LoginSchema } from '@/lib/schemas/login.schema'
import { api } from '@/api/api'
import { QUERY_KEY } from '@/lib/constants'
import { getToken, saveToken } from '@/lib/localstorage'
import { RegisterSchema } from '@/lib/schemas/register.schema'

interface LoginResponse {
  accessToken: string
  user: User
}

interface RegisterResponse {
  accessToken: string
  user: User
}

const routes = {
  login: '/auth/login',
  register: '/auth/register',
  profile: '/auth/profile',
} as const

export const login = async (values: LoginSchema): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>(routes.login, values)
  return data
}

export const register = async (
  values: RegisterSchema,
): Promise<LoginResponse> => {
  const { data } = await api.post<RegisterResponse>(routes.register, values)
  return data
}

export const fetchProfile = async (): Promise<User> => {
  const { data } = await api.get<User>(routes.profile)
  return data
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

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  })
}

export const useProfile = () =>
  useQuery({
    enabled: Boolean(getToken()),
    queryKey: [QUERY_KEY.profile],
    queryFn: fetchProfile,
  })
