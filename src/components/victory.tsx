import { IMAGES, TIME_WIN_INCREASE_NUMBER } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/store/settings.store'
import { useSoloStore } from '@/store/solo.store'
import { useEffect } from 'react'
import { AnimationInOut } from '@/components/animation-in-out'

const Victory = ({ show }: { show: boolean }) => {
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const jackpot = useSoloStore(({ jackpot }) => jackpot)
  const setIncreaseTime = useSoloStore(({ setIncreaseTime }) => setIncreaseTime)

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
        className='flex flex-col gap-2 bg-white bg-cover bg-center bg-no-repeat p-4'
        style={{ backgroundImage: `url(${IMAGES.texture})` }}
      >
        <div className='text-green text-4xl'>Victory</div>
        <div className='flex gap-10'>
          <div className='text-[42px]'>Lvl</div>
          <ul className='pt-4 text-right'>
            <li className='text-lg'>Old rating: 722</li>
            <li className='text-xl'>new rating: 754</li>
          </ul>
        </div>
      </div>
    </AnimationInOut>
  )
}

export { Victory }
