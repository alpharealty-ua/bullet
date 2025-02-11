import { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { cn } from '@/lib/utils'

const Result = ({
  topText,
  bottomText,
  price,
  offer,
  open,
}: {
  topText: string
  bottomText: string
  price: string
  offer: string
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
            className='z-3 flex flex-col items-center gap-1 px-6'
          >
            <div
              className={cn(
                'fill-mode-both origin-top text-xl leading-[1] font-bold',
                open &&
                  'animate-in fade-in slide-in-from-top-6 delay-500 duration-500',
                close && 'animate-out fade-out zoom-out-50 duration-200',
              )}
            >
              {topText}
            </div>
            <div
              className={cn(
                'fill-mode-both max-w-[300px] origin-top text-5xl text-[#006100] drop-shadow-[2px_1px_0px_#000]',
                open &&
                  'animate-in fade-in slide-in-from-top-6 delay-750 duration-500',
                close && 'animate-out fade-out zoom-out-50 duration-200',
              )}
            >
              {price}
            </div>
            <div
              className={cn(
                'fill-mode-both origin-top text-xl leading-[1] font-bold',
                open &&
                  'animate-in fade-in slide-in-from-top-6 delay-1250 duration-500',
                close && 'animate-out fade-out zoom-out-50 duration-200',
              )}
            >
              {bottomText}
            </div>
            <div
              className={cn(
                'fill-mode-both max-w-[300px] origin-top text-5xl text-[#006100] drop-shadow-[2px_1px_0px_#000]',
                open &&
                  'animate-in fade-in slide-in-from-top-6 delay-1500 duration-500',
                close && 'animate-out fade-out zoom-out-50 duration-200',
              )}
            >
              {offer}
            </div>
          </div>
        )
      }}
    </CSSTransition>
  )
}

export { Result }
