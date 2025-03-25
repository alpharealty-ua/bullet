import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { AUDIOS, SettingsKeys } from '@/lib/constants'
import { getAudio } from '@/lib/utils'

export type PlaySound = (
  key: keyof typeof AUDIOS,
  play?: boolean,
) => Promise<HTMLAudioElement>
interface SettingsState extends Record<SettingsKeys, boolean> {
  change: (payload: Partial<Record<SettingsKeys, boolean>>) => void
  // TODO: MOVE
  // TODO: RENAME TO PLAY SOUND
  playAudio: PlaySound
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      music: true,
      soundEffects: true,
      invertButtons: false,
      blood: false,
      declineAllDeals: false,
      change: (payload: Partial<Record<SettingsKeys, boolean>>) =>
        set({ ...payload }),
      playAudio: async (
        key: keyof typeof AUDIOS,
        play = true,
      ): Promise<HTMLAudioElement> => {
        const audio = getAudio(key)

        // TODO: MOVE TO ADUIO
        audio.addEventListener(
          'ended',
          () => {
            console.log('Play audio - ' + audio.src)
          },
          { once: true },
        )

        // TODO: MOVE TO ADUIO
        audio.muted = !get().soundEffects
        audio.currentTime = 0

        try {
          if (play) {
            await audio.play()
          }
        } catch (error) {
          if (play) {
            console.log(audio.duration)
            setTimeout(
              () => audio.dispatchEvent(new Event('ended')),
              audio.duration * 1000,
            )
          }
          console.log(error)
        }

        return audio
      },
    }),
    { name: 'settings-store' },
  ),
)

export { useSettingsStore }
