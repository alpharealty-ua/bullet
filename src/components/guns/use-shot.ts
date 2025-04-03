import { waitEndAudio } from '@/lib/utils'
import { PlaySound } from '@/store/settings.store'

const useShot = (
  playAudio: PlaySound,
  setShowShot: React.Dispatch<boolean>,
) => {
  return async () => {
    const gunShotAudio = await playAudio('gunshot')

    setShowShot(true)

    await waitEndAudio(gunShotAudio)

    setShowShot(false)
  }
}

export { useShot }
