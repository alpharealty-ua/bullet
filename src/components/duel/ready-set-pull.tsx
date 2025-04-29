import { useImperativeHandle, useRef } from 'react'

import { useSettingsStore } from '@/store/settings.store'
import { cn, waitEndAudio } from '@/lib/utils'

export interface ReadySetPullHandle {
  startAll: () => Promise<void>
  start: (value: ReadySetPull) => Promise<void>
}

export type ReadySetPull = 'ready' | 'set' | 'pull'

export interface ReadySetPullProps extends React.ComponentProps<'div'> {
  readySetPullHandle?: React.ForwardedRef<ReadySetPullHandle>
}

const ReadySetPull = ({
  readySetPullHandle,
  className,
  ...props
}: ReadySetPullProps) => {
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const startAll = async () => {
    await start('ready')
    await start('set')
    await start('pull')
  }

  const start = async (value: ReadySetPull) => {
    const wrapperEl = wrapperRef.current
    const [readyEl, setEl, pullEl] =
      (wrapperEl?.children as HTMLCollectionOf<HTMLDivElement>) ?? []

    if (!(readyEl && setEl && pullEl)) {
      return
    }

    readyEl.classList.remove('is-show')
    setEl.classList.remove('is-show')
    pullEl.classList.remove('is-show')

    if (value === 'ready') {
      const readyAudio = await playAudio('ready')
      readyEl.classList.add('is-show')
      await waitEndAudio(readyAudio)
    }

    if (value === 'set') {
      const setAudio = await playAudio('ready')
      readyEl.classList.add('is-show')
      setEl.classList.add('is-show')
      await waitEndAudio(setAudio)
    }

    if (value === 'pull') {
      const pullAudio = await playAudio('pull')
      readyEl.classList.add('is-show')
      setEl.classList.add('is-show')
      pullEl.classList.add('is-show')
      await waitEndAudio(pullAudio)
    }

    readyEl.classList.remove('is-show')
    setEl.classList.remove('is-show')
    pullEl.classList.remove('is-show')
  }

  useImperativeHandle(readySetPullHandle, () => ({
    startAll,
    start,
  }))

  return (
    <div
      ref={wrapperRef}
      className={cn('flex flex-col gap-1 text-[2.5rem]', className)}
      {...props}
    >
      <div
        className={cn(
          'relative -left-4 opacity-0 duration-500 [&.is-show]:left-0 [&.is-show]:opacity-100',
        )}
      >
        Ready
      </div>
      <div
        className={cn(
          'relative -left-4 pl-8 opacity-0 duration-500 [&.is-show]:left-0 [&.is-show]:opacity-100',
        )}
      >
        Set
      </div>
      <div
        className={cn(
          'relative -left-4 pl-14 opacity-0 duration-500 [&.is-show]:left-0 [&.is-show]:opacity-100',
        )}
      >
        Pull
      </div>
    </div>
  )
}

export { ReadySetPull }
