import React from 'react'
import classNames from 'classnames'
import { images } from '@/lib/constants'

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={classNames(
        'relative h-[44px] w-[44px] cursor-pointer bg-contain bg-center bg-no-repeat transition-transform active:scale-75 disabled:cursor-not-allowed',
        className,
      )}
      style={{ backgroundImage: `url(${images.close})` }}
      {...props}
    ></button>
  )
})
