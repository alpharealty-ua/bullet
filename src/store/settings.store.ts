import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  AudioKeys,
  AUDIOS,
  DEFAULT_SETTINGS,
  SettingsKeys,
} from '@/lib/constants'

export type PlaySound = (
  key: AudioKeys,
  play?: boolean,
) => Promise<HTMLAudioElement>
interface SettingsState extends Record<SettingsKeys, boolean> {
  change: (payload: Partial<Record<SettingsKeys, boolean>>) => void
  getSound: (key: AudioKeys) => HTMLAudioElement
  playSound: PlaySound
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,
      change: (payload: Partial<Record<SettingsKeys, boolean>>) =>
        set({ ...payload }),
      getSound: (key: AudioKeys): HTMLAudioElement => {
        const audioEl = new Audio(AUDIOS[key])
        const muted = !get().soundEffects

        audioEl.muted = muted
        audioEl.currentTime = 0

        const nativePlay = audioEl.play

        audioEl.play = async () => {
          try {
            await nativePlay.call(audioEl)
          } catch (error) {
            const duration = (audioEl.duration || 1) * 1000
            setTimeout(
              () => audioEl.dispatchEvent(new Event('ended')),
              duration,
            )
          }
        }

        return audioEl
      },
      playSound: async (
        key: AudioKeys,
        play = true,
      ): Promise<HTMLAudioElement> => {
        const audioEl = get().getSound(key)

        if (play) {
          await audioEl.play()
        }

        return audioEl
      },
    }),
    { name: 'settings-store' },
  ),
)

export { useSettingsStore }
