import { useEffect, useRef } from 'react'

import { useAppContext } from '@/context/use-app-context'
import { wait, waitEndAudio } from '@/lib/utils'

export const StartGameText = () => {
  const { playAudio } = useAppContext()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapperDom = wrapperRef.current

    if (wrapperDom === null) {
      return
    }

    console.log('call')

    const [ready, set, pull] =
      wrapperDom.children as HTMLCollectionOf<HTMLDivElement>

    if (!(ready && set && pull)) {
      return
    }

    const runAnimation = async () => {
      ready.classList.remove('opacity-100')
      set.classList.remove('opacity-100')
      pull.classList.remove('opacity-100')

      await wait(100)

      const readyAudio = await playAudio('ready')
      ready.classList.add('opacity-100')
      await waitEndAudio(readyAudio)

      const setAudio = await playAudio('set')
      set.classList.add('opacity-100')
      await waitEndAudio(setAudio)

      const pullAudio = await playAudio('pull')
      pull.classList.add('opacity-100')
      await waitEndAudio(pullAudio)
    }

    runAnimation()
  }, [playAudio])

  return (
    <div
      ref={wrapperRef}
      className='absolute bottom-0 left-10 flex flex-col gap-1 text-[40px]'
    >
      <div className='opacity-0 duration-500'>Ready</div>
      <div className='pl-8 opacity-0 duration-500'>Set</div>
      <div className='pl-14 opacity-0 duration-500'>Pull</div>
    </div>
  )
}
