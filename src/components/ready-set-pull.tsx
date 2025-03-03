import { useCallback, useImperativeHandle, useRef } from 'react'

import { useSettingsStore } from '@/store/settings.store'
import { cn, waitEndAudio } from '@/lib/utils'

export type ReadySetPullHandle = {
  start: () => Promise<void>
}

const ReadySetPull = ({
  show,
  onStart,
  onEnd,
  readySetPullHandle,
}: {
  show: boolean
  onStart: () => void
  onEnd: () => void
  readySetPullHandle: React.ForwardedRef<ReadySetPullHandle>
}) => {
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const start = useCallback(async () => {
    const wrapperDom = wrapperRef.current

    if (wrapperDom === null) {
      return
    }

    const [ready, set, pull] =
      wrapperDom.children as HTMLCollectionOf<HTMLDivElement>

    if (!(ready && set && pull)) {
      return
    }

    ready.classList.remove('is-show')
    set.classList.remove('is-show')
    pull.classList.remove('is-show')

    onStart()

    const readyAudio = await playAudio('ready')
    ready.classList.add('is-show')
    await waitEndAudio(readyAudio)

    const setAudio = await playAudio('set')
    set.classList.add('is-show')
    await waitEndAudio(setAudio)

    const pullAudio = await playAudio('pull')
    pull.classList.add('is-show')
    await waitEndAudio(pullAudio)

    onEnd()
  }, [onStart, onEnd, playAudio])

  useImperativeHandle(readySetPullHandle, () => ({
    start,
  }))

  return (
    <div
      ref={wrapperRef}
      className='absolute bottom-0 left-10 flex flex-col gap-1 text-[40px]'
    >
      <div
        className={cn(
          'relative -left-4 opacity-0 duration-500 [&.is-show]:left-0 [&.is-show]:opacity-100',
          show && 'is-show',
        )}
      >
        Ready
      </div>
      <div
        className={cn(
          'relative -left-4 pl-8 opacity-0 duration-500 [&.is-show]:left-0 [&.is-show]:opacity-100',
          show && 'is-show',
        )}
      >
        Set
      </div>
      <div
        className={cn(
          'relative -left-4 pl-14 opacity-0 duration-500 [&.is-show]:left-0 [&.is-show]:opacity-100',
          show && 'is-show',
        )}
      >
        Pull
      </div>
    </div>
  )
}

export { ReadySetPull }
