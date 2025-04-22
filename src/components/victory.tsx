import { useImperativeHandle } from 'react'

import { UpdateShowMethods, useUpdateShow } from '@/hooks/use-update-show'
import { useSettingsStore } from '@/store/settings.store'
import { IMAGES } from '@/lib/constants'
import { cn, waitEndAudio } from '@/lib/utils'
import { AnimationInOut } from '@/components/ui/animation-in-out'

export interface VictoryHandle extends UpdateShowMethods<VictoryState> {
  runSound: () => AsyncGenerator<void>
}

interface VictoryProps {
  victoryHandleRef?: React.ForwardedRef<VictoryHandle>
}

interface VictoryState {
  show: boolean
  type: 'win' | 'draw'
  win: number | null
  oldLevel: number | null
  newLevel: number | null
}

const Victory = ({ victoryHandleRef }: VictoryProps) => {
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const {
    state: { show, type, win, oldLevel, newLevel },
    timeout,
    ...methods
  } = useUpdateShow<VictoryState>({
    show: false,
    type: 'win',
    win: null,
    oldLevel: null,
    newLevel: null,
  })

  const isWin = type === 'win'
  const isDraw = type === 'draw'

  const runSound = async function* () {
    const winSoundAudio = await playAudio('winsound', false)
    const chachingAudio = await playAudio('chaching')

    yield void (await waitEndAudio(chachingAudio))
    await winSoundAudio.play()
    await waitEndAudio(winSoundAudio)
  }

  useImperativeHandle(victoryHandleRef, () => ({
    runSound,
    ...methods,
  }))

  return (
    <AnimationInOut
      in={show}
      unmountOnExit
      timeout={timeout}
      className={cn(
        'absolute top-1/2 right-0 left-0 z-10 -translate-y-1/2 py-2.5',
        'zoom-in-200 zoom-out-200 duration-400',
        isWin && 'bg-green/50',
        isDraw && 'bg-primary/50',
      )}
    >
      <div
        className='flex flex-col gap-4 bg-white bg-cover bg-center bg-no-repeat p-4'
        style={{ backgroundImage: `url(${IMAGES.texture})` }}
      >
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
        {typeof win === 'number' && (
          <div className='text-4xl'>
            You won - <span className='text-green'>${win}</span>
          </div>
        )}
        {(typeof oldLevel === 'number' || typeof newLevel === 'number') && (
          <div className='flex gap-10'>
            <div className='text-4xl'>Lvl</div>
            <ul className='pt-4 text-right'>
              <li className='text-lg'>Old rating: {oldLevel}</li>
              <li className='text-xl'>new rating: {newLevel}</li>
            </ul>
          </div>
        )}
      </div>
    </AnimationInOut>
  )
}

export { Victory }
