import { create } from 'zustand'
import { audios, SettingsKeys } from '@/lib/constants'
import { getAudio } from '@/lib/utils'

type SettingsState = Record<SettingsKeys, boolean> & {
  change: (payload: Partial<Record<SettingsKeys, boolean>>) => void
  // TODO: MOVE
  playAudio: (
    key: keyof typeof audios,
    play?: boolean,
  ) => Promise<HTMLAudioElement>
}

const useSettingsStore = create<SettingsState>()((set, get) => ({
  music: true,
  soundEffects: true,
  invertButtons: false,
  blood: false,
  declineAllDeals: false,
  change: (payload: Partial<Record<SettingsKeys, boolean>>) =>
    set({ ...payload }),
  playAudio: async (
    key: keyof typeof audios,
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

    try {
      // TODO: MOVE TO ADUIO
      audio.muted = !get().soundEffects
      if (play) {
        await audio.play()
      }

      return audio
    } catch (error) {
      console.log(error)
    }

    return audio
  },
}))

export { useSettingsStore }
