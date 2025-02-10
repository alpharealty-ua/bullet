import { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { cn } from '@/lib/utils'

const Result = ({
  topText,
  bottomText,
  price,
  open,
}: {
  topText: string
  bottomText: string
  price: string
  open: boolean
}) => {
  const nodeRef = useRef(null)

  return (
    <CSSTransition nodeRef={nodeRef} in={open} unmountOnExit timeout={400}>
      {(state) => {
        const open = state === 'entering' || state === 'entered'
        const close = state === 'exiting' || state === 'exited'

        return (
          <div
            ref={nodeRef}
            className='z-3 flex flex-col items-center gap-3 px-6 pt-3'
          >
            <div
              className={cn(
                'fill-mode-both origin-top text-2xl leading-[1] font-bold',
                open &&
                  'animate-in fade-in zoom-in-50 slide-in-from-top-6 delay-500 duration-500',
                close &&
                  'animate-out fade-out zoom-out-50 slide-out-to-top-6 delay-200 duration-200',
              )}
            >
              {topText}
            </div>
            <div
              className={cn(
                'fill-mode-both max-w-[300px] text-5xl text-[#006100] drop-shadow-[2px_1px_0px_#000]',
                open &&
                  'animate-in fade-in zoom-in-50 delay-1000 duration-1000',
                close && 'animate-out fade-out zoom-out-50 duration-200',
              )}
            >
              {price}
            </div>
            <div
              className={cn(
                'fill-mode-both origin-top text-2xl leading-[1] font-bold',
                open &&
                  'animate-in fade-in zoom-in-50 slide-in-from-bottom-6 delay-500 duration-500',
                close &&
                  'animate-out fade-out zoom-out-50 slide-out-to-bottom-6 delay-200 duration-200',
              )}
            >
              {bottomText}
            </div>
          </div>
        )
      }}
    </CSSTransition>
  )
}

export { Result }
