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

const authRoutes = {
  login: '/auth/login',
  register: '/auth/register',
  profile: '/auth/profile',
}

export const login = async (values: LoginSchema): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>(authRoutes.login, values)
  saveToken(data.accessToken)
  return data
}

interface RegisterResponse {
  accessToken: string
  user: User
}

export const register = async (
  values: RegisterSchema,
): Promise<LoginResponse> => {
  const { data } = await api.post<RegisterResponse>(authRoutes.register, values)
  return data
}

export const fetchProfile = async (): Promise<User> => {
  const { data } = await api.get<User>(authRoutes.profile)
  return data
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
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
