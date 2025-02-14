import React, { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import mergeRefs from 'merge-refs'

import { cn } from '@/lib/utils'
import { images } from '@/lib/constants'
import { Button } from './ui/button'
import { Logo } from './logo'

export const Modal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
    onClose: () => void
    open: boolean
    hideHeader?: boolean
  }
>(
  (
    { children, onClose, hideHeader = false, open, className, ...props },
    ref,
  ) => {
    const nodeRef = useRef<HTMLDivElement>(null)

    return (
      <CSSTransition nodeRef={nodeRef} in={open} unmountOnExit timeout={400}>
        {(state) => {
          const open = state === 'entering' || state === 'entered'
          const close = state === 'exiting' || state === 'exited'

          return (
            <div
              ref={mergeRefs(nodeRef, ref)}
              className={cn(
                'fill-mode-both custom-scroll absolute inset-0 z-50 flex flex-col gap-12 overflow-auto bg-cover bg-[right_center] px-3 py-12 duration-200',
                className,
                open && 'animate-in fade-in-0 zoom-in-95',
                close && 'animate-out fade-out-0 zoom-out-95',
              )}
              style={{ backgroundImage: `url(${images.wrapper})` }}
              {...props}
            >
              {!hideHeader && (
                <div className='flex items-center justify-between'>
                  <Logo size='lg' />
                  <Button className='w-11' image='close' onClick={onClose} />
                </div>
              )}
              {children}
            </div>
          )
        }}
      </CSSTransition>
    )
  },
)
