import { useMutation, useQuery } from '@tanstack/react-query'

import { api, QUERY_KEYS, ROUTE_PREFIX } from '@/api/api'
import { useAuthStore } from '@/store/auth.store'
import { LoginSchema } from '@/lib/schemas/login.schema'
import { RegisterSchema } from '@/lib/schemas/register.schema'
import { ForgotPasswordSchema } from '@/lib/schemas/forgot-password.schema.ts'
import { ResetPasswordSchema } from '@/lib/schemas/reset-password.schema.ts'
import { userSchema, UserSchema } from '@/lib/schemas/auth.schema'

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: UserSchema
}

interface RegisterResponse {
  accessToken: string
  user: UserSchema
}

interface RefreshTokenPayload {
  refreshToken: string
}

interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

interface ProfileResponse extends UserSchema {}

interface ForgotPasswordResponse {
  message: string
}

interface ResetPasswordResponse {
  message: string
}

interface GoogleAuthPayload {
  code: string
}

interface GoogleAuthResponse {
  accessToken: string
  refreshToken: string
  user: UserSchema
}

const prefix = ROUTE_PREFIX.auth

const routes = {
  login: `/${prefix}/login`,
  register: `/${prefix}/register`,
  refreshToken: `/${prefix}/refresh-token`,
  profile: `/${prefix}/profile`,
  forgotPassword: `/${prefix}/forgot-password`,
  resetPassword: `/${prefix}/reset-password`,
  googleCallback: `/${prefix}/google`,
} as const

export const login = async (values: LoginSchema): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>(routes.login, values)
  return data
}

export const register = async (
  values: RegisterSchema,
): Promise<RegisterResponse> => {
  const { data } = await api.post<RegisterResponse>(routes.register, values)
  return data
}

export const refreshToken = async (
  values: RefreshTokenPayload,
): Promise<RefreshTokenResponse> => {
  const { data } = await api.post<RefreshTokenResponse>(
    routes.refreshToken,
    values,
  )
  return data
}

export const fetchProfile = async (): Promise<UserSchema> => {
  const { data } = await api.get<ProfileResponse>(routes.profile)
  return userSchema.parse(data)
}

export const forgotPassword = async (
  values: ForgotPasswordSchema,
): Promise<ForgotPasswordResponse> => {
  const { data } = await api.post<ForgotPasswordResponse>(
    routes.forgotPassword,
    values,
  )
  return data
}

export const resetPassword = async (
  values: ResetPasswordSchema,
): Promise<ResetPasswordResponse> => {
  const { data } = await api.post<ResetPasswordResponse>(
    routes.resetPassword,
    values,
  )
  return data
}

export const googleAuth = async (
  values: GoogleAuthPayload,
): Promise<GoogleAuthResponse> => {
  const { data } = await api.post<GoogleAuthResponse>(
    routes.googleCallback,
    values,
  )
  return data
}

export const useLogin = () => {
  const setTokens = useAuthStore(({ setTokens }) => setTokens)

  return useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken, refreshToken }) => {
      setTokens({ accessToken, refreshToken })
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
    throw new Error('useUser should be used within <ProtectedRoute>')
  }

  return user
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  })
}

export const useGoogleAuth = () => {
  const setTokens = useAuthStore(({ setTokens }) => setTokens)

  return useMutation({
    mutationFn: googleAuth,
    onSuccess: ({ accessToken, refreshToken }) => {
      setTokens({ accessToken, refreshToken })
    },
  })
}
