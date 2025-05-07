import { ComponentProps, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { cn } from '@/lib/utils'

type AnimationInOutProps = Partial<ComponentProps<typeof CSSTransition>> & {
  children: React.ReactNode
  className?: string
}

const AnimationInOut = ({
  children,
  className,
  ...props
}: AnimationInOutProps) => {
  const nodeRef = useRef(null)

  return (
    <CSSTransition nodeRef={nodeRef} timeout={400} unmountOnExit {...props}>
      {(state) => {
        const open = state === 'entering' || state === 'entered'
        const close = state === 'exiting' || state === 'exited'
        return (
          <div
            ref={nodeRef}
            className={cn(
              'fill-mode-both fade-in fade-out duration-400',
              open && 'animate-in',
              close && 'animate-out',
              className,
            )}
            data-open={open}
            data-close={close}
          >
            {children}
          </div>
        )
      }}
    </CSSTransition>
  )
}

export { AnimationInOut }
