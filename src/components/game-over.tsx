import { useImperativeHandle } from 'react'

import { UpdateShowMethods, useUpdateShow } from '@/hooks/use-update-show'
import { useSettingsStore } from '@/store/settings.store'
import { IMAGES } from '@/lib/constants'
import { cn, waitEndAudio } from '@/lib/utils'
import { AnimationInOut } from '@/components/animation-in-out'

export interface GameOverHandle extends UpdateShowMethods<GameOverState> {
  runSound: () => AsyncGenerator<void>
}

interface GameOverState {
  show: boolean
  disabled: boolean
  on: ((event: 'click' | 'timeout') => Promise<void>) | null
}

interface GameOverProps {
  gameOverHandleRef?: React.ForwardedRef<GameOverHandle>
}

const GameOver = ({ gameOverHandleRef }: GameOverProps) => {
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const blood = useSettingsStore(({ blood }) => blood)
  const {
    state: { show, disabled, on },
    timeout,
    ...methods
  } = useUpdateShow<GameOverState>({
    show: false,
    disabled: false,
    on: null,
  })

  const runSound = async function* () {
    const audio = await playAudio('drumbeat')
    yield
    await waitEndAudio(audio)
  }

  useImperativeHandle(gameOverHandleRef, () => ({
    runSound,
    ...methods,
  }))

  // TODO: MAYBE CHANGED TO PROPS ON_CLICK LIKE REMATCH REQUEST
  const handleClick = () => {
    on && on('click')
  }

  return (
    <AnimationInOut
      in={show}
      unmountOnExit
      timeout={timeout}
      className={cn('absolute inset-0 z-50 flex', 'duration-0')}
    >
      <button
        className={cn('h-full w-full', !disabled && 'cursor-pointer')}
        onClick={handleClick}
        disabled={disabled}
      >
        <div
          className={cn(
            'absolute inset-0 bg-cover bg-center',
            'animate-in fade-in fill-mode-both duration-100',
          )}
          style={!blood ? { backgroundImage: `url(${IMAGES.blood})` } : {}}
        >
          <div
            className={cn(
              'absolute bottom-[72%] left-[30%] h-35 w-35 bg-contain bg-center text-5xl text-transparent uppercase select-none',
              'animate-in fade-in fill-mode-both delay-100 duration-100',
            )}
            style={{ backgroundImage: `url(${IMAGES.you})` }}
          >
            You
          </div>
          <div
            className={cn(
              'uppercasee absolute top-[46%] right-[8%] h-38 w-39 bg-contain bg-center text-5xl text-transparent select-none',
              'animate-in fade-in fill-mode-both delay-200 duration-100',
            )}
            style={{ backgroundImage: `url(${IMAGES.died})` }}
          >
            Died
          </div>
        </div>
      </button>
    </AnimationInOut>
  )
}

export { GameOver }
