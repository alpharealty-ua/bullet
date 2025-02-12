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
        'aspect-[0.8] w-[30px] cursor-pointer bg-[length:170%] bg-center bg-no-repeat',
        className,
      )}
      style={{ backgroundImage: `url(${images.money})` }}
      {...props}
    ></button>
  )
})
