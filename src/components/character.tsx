import React from 'react'

import { cn } from '@/lib/utils'
import { CHARACTER_IMAGES } from '@/lib/constants'
import { GunCharacter } from './character-gun'

const Character = React.forwardRef<
  HTMLDivElement,
  React.HtmlHTMLAttributes<HTMLDivElement> & { characterIndex: number }
>(({ characterIndex, className, style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative h-50 bg-contain bg-bottom bg-no-repeat',
        characterIndex === 0 && 'aspect-[1855/calc(1830*1.25)]',
        characterIndex === 1 && 'aspect-[1123/1415]',
        className,
      )}
      style={{
        backgroundImage: `url(${CHARACTER_IMAGES[characterIndex]})`,
        ...style,
      }}
      {...props}
    >
      <GunCharacter
        className={cn(
          'absolute',
          characterIndex === 0 && 'top-0 left-[30%] aspect-[1/2.3] w-[45%]',
          characterIndex === 1 && 'top-[15%] left-[7%] aspect-[1/1.7] w-[30%]',
        )}
      />
    </div>
  )
})

export { Character }
