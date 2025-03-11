import { getToken, removeToken, saveToken } from '@/lib/localstorage'
import { create } from 'zustand'

interface AuthState {
  token: string | null
  setToken: (token: string) => void
  resetToken: () => void
}

const useAuthStore = create<AuthState>()((set) => ({
  token: getToken() ?? null,
  setToken: (token: string) => {
    saveToken(token)
    set({ token })
  },
  resetToken: () => {
    removeToken()
    set({ token: null })
  },
}))

export { useAuthStore }
