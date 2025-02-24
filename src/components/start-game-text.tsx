import { useEffect, useRef } from 'react'

export const StartGameText = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // TODO: ADD SYNC ANIMATION
  }, [])

  return (
    <div
      ref={ref}
      className='absolute bottom-0 left-10 flex flex-col gap-1 text-[40px]'
    >
      <div className='animate-in fade-in-0 fill-mode-both duration-800'>
        Ready
      </div>
      <div className='animate-in fade-in-0 fill-mode-both pl-8 delay-200 duration-800'>
        Set
      </div>
      <div className='animate-in fade-in-0 fill-mode-both pl-14 delay-400 duration-800'>
        Pull
      </div>
    </div>
  )
}
