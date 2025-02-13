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
        'aspect-[1/1.5] w-8 cursor-pointer self-center bg-contain bg-center bg-no-repeat',
        className,
      )}
      style={{ backgroundImage: `url(${images.moneybag})` }}
      {...props}
    ></button>
  )
})
