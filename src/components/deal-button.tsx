import React from 'react'
import classNames from 'classnames'
import { images } from '@/lib/constants'

export const DealButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={classNames(
        'relative aspect-[1/0.72] w-[120px] cursor-pointer bg-contain bg-center bg-no-repeat transition-transform active:scale-75 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      style={{ backgroundImage: `url(${images.deal})` }}
      {...props}
    ></button>
  )
})
