import { getItem, removeItem, setItem } from '@/lib/localstorage'
import { create } from 'zustand'

interface AuthState {
  token: string | null
  setToken: (token: string) => void
  resetToken: () => void
}

const useAuthStore = create<AuthState>()((set) => ({
  token: getItem('token') ?? null,
  setToken: (token: string) => {
    setItem('token', token)
    set({ token })
  },
  resetToken: () => {
    removeItem('token')
    set({ token: null })
  },
}))

export { useAuthStore }
