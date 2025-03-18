import { useEffect } from 'react'

import { IMAGES, TIME_WIN_INCREASE_NUMBER } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/store/settings.store'
import { useGameStore } from '@/store/game.store'
import { AnimationInOut } from '@/components/animation-in-out'

const Victory = () => {
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const state = useGameStore(({ state }) => state)
  const jackpot = useGameStore(({ jackpot }) => jackpot)
  const setIncreaseTime = useGameStore(({ setIncreaseTime }) => setIncreaseTime)
  const show = state === 'win'

  useEffect(() => {
    if (!show) {
      return
    }

    const runAnimation = async () => {
      const winSoundAudio = await playAudio('winsound', false)
      const chachingAudio = await playAudio('chaching')

      // TODO: GET DURATION FROM AUDIO
      setIncreaseTime(TIME_WIN_INCREASE_NUMBER)

      const chachingEnded = async () => {
        winSoundAudio.play()
      }

      const winSoundEnded = () => {
        setIncreaseTime(undefined)
      }

      winSoundAudio.addEventListener('ended', winSoundEnded, {
        once: true,
      })

      chachingAudio.addEventListener('ended', chachingEnded, {
        once: true,
      })
    }

    runAnimation()
  }, [show, playAudio, jackpot, setIncreaseTime])

  return (
    <AnimationInOut
      in={show}
      unmountOnExit
      timeout={400}
      className={cn(
        'bg-green/50 absolute top-1/2 right-0 left-0 z-10 -translate-y-1/2 py-[10px]',
        'zoom-in-200 duration-500',
      )}
    >
      <div
        className='flex flex-col gap-4 bg-white bg-cover bg-center bg-no-repeat p-4'
        style={{ backgroundImage: `url(${IMAGES.texture})` }}
      >
        <div className='text-green text-4xl'>Victory</div>
        <div className='flex w-full justify-between text-4xl'>
          <div>You won - ${jackpot}</div>
        </div>
      </div>
    </AnimationInOut>
  )
}

export { Victory }
