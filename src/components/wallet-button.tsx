import React from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const WalletButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'h-[30px] w-[30px] cursor-pointer bg-contain bg-center bg-no-repeat',
        className,
      )}
      style={{ backgroundImage: `url(${images.money})` }}
      {...props}
    ></button>
  )
})
