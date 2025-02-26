import { useEffect, useRef } from 'react'

import { useAppContext } from '@/context/use-app-context'
import { wait, waitEndAudio } from '@/lib/utils'

const ReadySetPull = () => {
  const { playAudio } = useAppContext()
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

    const activeClassList = ['opacity-100', 'left-0']

    const runAnimation = async () => {
      ready.classList.remove(...activeClassList)
      set.classList.remove(...activeClassList)
      pull.classList.remove(...activeClassList)

      await wait(0)

      if (isUnmounted) {
        return
      }

      const readyAudio = await playAudio('ready')
      ready.classList.add(...activeClassList)
      await waitEndAudio(readyAudio)

      const setAudio = await playAudio('set')
      set.classList.add(...activeClassList)
      await waitEndAudio(setAudio)

      const pullAudio = await playAudio('pull')
      pull.classList.add(...activeClassList)
      await waitEndAudio(pullAudio)
    }
    let isUnmounted = false
    runAnimation()

    return () => {
      isUnmounted = true
    }
  }, [playAudio])

  return (
    <div
      ref={wrapperRef}
      className='absolute bottom-0 left-10 flex flex-col gap-1 text-[40px]'
    >
      <div className='relative -left-4 opacity-0 duration-500'>Ready</div>
      <div className='relative -left-4 pl-8 opacity-0 duration-500'>Set</div>
      <div className='relative -left-4 pl-14 opacity-0 duration-500'>Pull</div>
    </div>
  )
}

export { ReadySetPull }
