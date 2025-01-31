import React from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const PullButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'relative aspect-[1/0.84] w-[92px] cursor-pointer bg-contain bg-center bg-no-repeat transition-transform active:scale-75 disabled:scale-100 disabled:cursor-not-allowed',
        className,
      )}
      style={{ backgroundImage: `url(${images.pull})` }}
      {...props}
    ></button>
  )
})
