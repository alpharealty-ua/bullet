import React from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

const GunCharacter = React.forwardRef<
  HTMLDivElement,
  React.HtmlHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('relative aspect-[1/1.95]', className)}
      {...props}
    >
      <div
        className='absolute top-[10%] right-0 left-0 aspect-square animate-spin bg-contain bg-center bg-no-repeat duration-5000'
        style={{
          backgroundImage: `url(${images.gunchambercharacter})`,
        }}
      ></div>
      <div
        className='absolute inset-0 bg-contain bg-center bg-no-repeat'
        style={{
          backgroundImage: `url(${images.gunbodycharacter})`,
        }}
      ></div>
    </div>
  )
})

export { GunCharacter }
