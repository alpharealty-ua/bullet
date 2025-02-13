import React from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

const imagesMap = {
  pull: images.pull,
  deal: images.deal,
  gamerules: images.gamerules,
  close: images.close,
  moneybag: images.moneybag,
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    image: keyof typeof imagesMap
  }
>(({ className, image, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'relative w-24 cursor-pointer bg-contain bg-center bg-no-repeat transition-transform active:scale-75 disabled:scale-100 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <img src={imagesMap[image]} alt='' />
    </button>
  )
})
