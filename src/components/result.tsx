import { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { cn } from '@/lib/utils'
import { useIncreaseNumber } from '@/hooks/increase-number'

const Result = ({
  title,
  price,
  open,
}: {
  title: string
  price: number
  open: boolean
}) => {
  const nodeRef = useRef(null)
  const { textRef } = useIncreaseNumber(price, open)

  return (
    <CSSTransition nodeRef={nodeRef} in={open} unmountOnExit timeout={800}>
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
              {title}
            </div>
            <div
              className={cn(
                'fill-mode-both max-w-[300px] origin-top text-5xl text-[#006100]',
                open &&
                  'animate-in fade-in slide-in-from-top-6 delay-750 duration-500',
                close && 'animate-out fade-out zoom-out-50 duration-200',
              )}
            >
              $<span ref={textRef}></span>
            </div>
          </div>
        )
      }}
    </CSSTransition>
  )
}

export { Result }
