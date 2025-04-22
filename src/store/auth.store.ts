import { QUERY_KEYS } from '@/api/api'
import { queryClient } from '@/api/query-client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
  resetTokens: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: ({
        accessToken,
        refreshToken,
      }: {
        accessToken: string
        refreshToken: string
      }) => {
        set({ accessToken, refreshToken })
      },
      resetTokens: async () => {
        set({ accessToken: null, refreshToken: null })
        await queryClient.setQueryData([QUERY_KEYS.profile], null)
      },
    }),
    { name: 'auth-store' },
  ),
)

export { useAuthStore }
