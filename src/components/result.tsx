import { forwardRef, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { cn } from '@/lib/utils'

const Result = forwardRef<
  HTMLDivElement,
  {
    title: string
    price: string
    open: boolean
  }
>(({ title, price, open }, ref) => {
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
                open && 'animate-in fade-in zoom-in-50 delay-500 duration-500',
                close &&
                  'animate-out fade-out zoom-out-50 delay-200 duration-200',
              )}
            >
              {title}
            </div>
            <div
              className={cn(
                'fill-mode-both max-w-[300px] text-6xl text-[#006100] drop-shadow-[2px_1px_0px_#000]',
                open && 'animate-in fade-in delay-1000 duration-1000',
                close && 'animate-out fade-out duration-200',
              )}
            >
              {price}
            </div>
          </div>
        )
      }}
    </CSSTransition>
  )
})

export { Result }
