import { create } from 'zustand'
import { SettingsKeys } from '@/lib/constants'

type SettingsState = Record<SettingsKeys, boolean> & {
  change: (payload: Partial<Record<SettingsKeys, boolean>>) => void
}

const useSettings = create<SettingsState>()((set) => ({
  music: true,
  soundEffects: true,
  invertButtons: false,
  blood: false,
  declineAllDeals: false,
  change: (payload: Partial<Record<SettingsKeys, boolean>>) =>
    set({ ...payload }),
}))

export { useSettings }
