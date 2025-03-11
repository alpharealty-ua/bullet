import { useMutation, useQuery } from '@tanstack/react-query'

import { api, QUERY_KEYS } from '@/api/api'
import { useAuthStore } from '@/store/auth.store'
import { LoginSchema } from '@/lib/schemas/login.schema'
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
  const setToken = useAuthStore(({ setToken }) => setToken)

  return useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken }) => {
      setToken(accessToken)
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  })
}

export const useProfile = (enabled = false) =>
  useQuery({
    enabled: enabled,
    queryKey: [QUERY_KEYS.profile],
    queryFn: fetchProfile,
  })

export const useUser = () => {
  const { data: user } = useQuery({
    enabled: false,
    queryKey: [QUERY_KEYS.profile],
    queryFn: fetchProfile,
  })

  if (user == null) {
    throw new Error('User not found')
  }

  return user
}
