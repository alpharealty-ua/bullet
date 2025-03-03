import { useEffect, useRef } from 'react'

import { useSettingsStore } from '@/store/settings.store'
import { wait, waitEndAudio } from '@/lib/utils'

const ReadySetPull = ({
  onStart,
  onEnd,
}: {
  onStart: () => void
  onEnd: () => void
}) => {
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapperDom = wrapperRef.current

    if (wrapperDom === null) {
      return
    }

    const [ready, set, pull] =
      wrapperDom.children as HTMLCollectionOf<HTMLDivElement>

    if (!(ready && set && pull)) {
      return
    }

    const runAnimation = async () => {
      ready.classList.remove('is-show')
      set.classList.remove('is-show')
      pull.classList.remove('is-show')

      await wait(0)

      if (isUnmounted) {
        return
      }

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
    }
    let isUnmounted = false
    runAnimation()

    return () => {
      isUnmounted = true
    }
  }, [playAudio, onStart, onEnd])

  return (
    <div
      ref={wrapperRef}
      className='absolute bottom-0 left-10 flex flex-col gap-1 text-[40px]'
    >
      <div className='relative -left-4 opacity-0 duration-500 [&.is-show]:left-0 [&.is-show]:opacity-100'>
        Ready
      </div>
      <div className='relative -left-4 pl-8 opacity-0 duration-500 [&.is-show]:left-0 [&.is-show]:opacity-100'>
        Set
      </div>
      <div className='relative -left-4 pl-14 opacity-0 duration-500 [&.is-show]:left-0 [&.is-show]:opacity-100'>
        Pull
      </div>
    </div>
  )
}

export { ReadySetPull }
