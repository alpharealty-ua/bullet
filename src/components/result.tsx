import { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { cn } from '@/lib/utils'

const Result = ({
  title,
  value,
  open,
  hasDelay = false,
}: {
  title: string
  value: string
  open: boolean
  hasDelay?: boolean
}) => {
  const nodeRef = useRef(null)

  return (
    <CSSTransition nodeRef={nodeRef} in={open} unmountOnExit timeout={500}>
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
                'fill-mode-both origin-top text-2xl leading-[1]',
                open && 'animate-in fade-in slide-in-from-top-6 duration-500',
                close && 'animate-out fade-out zoom-out-50 duration-200',
                // TODO: REFACTOR
                hasDelay && 'delay-500',
              )}
            >
              {title}
            </div>
            <div
              className={cn(
                'fill-mode-both text-red max-w-[300px] origin-top text-4xl',
                open && 'animate-in fade-in slide-in-from-top-6 duration-500',
                close && 'animate-out fade-out zoom-out-50 duration-200',
                hasDelay && 'delay-750',
              )}
            >
              {value}
            </div>
          </div>
        )
      }}
    </CSSTransition>
  )
}

export { Result }
