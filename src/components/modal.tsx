import React, { useState } from 'react'

import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { CloseButton } from './close-button'

export const Modal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
    onClose?: () => void
    hideHeader?: boolean
  }
>(({ children, onClose, hideHeader = false, className, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    onClose && onClose()
  }

  return (
    <div
      ref={ref}
      className={cn(
        'fill-mode-both absolute inset-0 z-50 flex flex-col gap-12 px-3 py-12 duration-200',
        className,
        isOpen
          ? 'animate-in fade-in-0 zoom-in-95'
          : 'animate-out fade-out-0 zoom-out-95',
      )}
      {...props}
    >
      {!hideHeader && (
        <div className='flex items-center justify-between'>
          <Logo size='lg' />
          <CloseButton onClick={handleClose} />
        </div>
      )}
      {children}
    </div>
  )
})
