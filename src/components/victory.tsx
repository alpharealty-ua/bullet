import { useEffect } from 'react'

import { IMAGES, TIME_WIN_INCREASE_NUMBER } from '@/lib/constants'
import { cn, waitEndAudio } from '@/lib/utils'
import { useSettingsStore } from '@/store/settings.store'
import { useGameStore } from '@/store/game.store'
import { AnimationInOut } from '@/components/animation-in-out'

const Victory = ({
  hideWon,
  hideLvl,
  type,
  show,
}: {
  hideWon?: boolean
  hideLvl?: boolean
  type: 'win' | 'draw'
  show: boolean
}) => {
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const jackpot = useGameStore(({ jackpot }) => jackpot)
  const setIncreaseTime = useGameStore(({ setIncreaseTime }) => setIncreaseTime)
  const isWin = type === 'win'
  const isDraw = type === 'draw'

  useEffect(() => {
    if (!(show && isWin)) {
      return
    }

    const runAnimation = async () => {
      const winSoundAudio = await playAudio('winsound', false)
      const chachingAudio = await playAudio('chaching')

      // TODO: GET DURATION FROM AUDIO
      setIncreaseTime(TIME_WIN_INCREASE_NUMBER)

      await waitEndAudio(chachingAudio)
      await winSoundAudio.play()
      await waitEndAudio(winSoundAudio)

      setIncreaseTime(undefined)
    }

    runAnimation()
  }, [show, isWin, playAudio, jackpot, setIncreaseTime])

  return (
    <AnimationInOut
      in={show}
      unmountOnExit
      timeout={400}
      className={cn(
        'absolute top-1/2 right-0 left-0 z-10 -translate-y-1/2 py-[10px]',
        'zoom-in-200 duration-500',
        isWin && 'bg-green/50',
        isDraw && 'bg-primary/50',
      )}
    >
      <div
        className='flex flex-col gap-4 bg-white bg-cover bg-center bg-no-repeat p-4'
        style={{ backgroundImage: `url(${IMAGES.texture})` }}
      >
        {/* <div className='text-green text-4xl'>Victory</div> */}
        <div
          className={cn(
            'text-primary text-4xl',
            isWin && 'text-green',
            isDraw && 'text-primary',
          )}
        >
          {isWin && 'Victory'}
          {isDraw && 'Draw'}
        </div>
        {!hideWon && (
          <div className='text-4xl'>
            You won - <span className='text-green'>${jackpot}</span>
          </div>
        )}
        {!hideLvl && (
          <div className='flex gap-10'>
            <div className='text-4xl'>Lvl</div>
            <ul className='pt-4 text-right'>
              <li className='text-lg'>Old rating: 722</li>
              <li className='text-xl'>new rating: 754</li>
            </ul>
          </div>
        )}
      </div>
    </AnimationInOut>
  )
}

export { Victory }
