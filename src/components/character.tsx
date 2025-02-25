import React from 'react'

import { cn } from '@/lib/utils'
import { CHARACTER_IMAGES } from '@/lib/constants'
import { GunCharacter } from './character-gun'

interface CharacterProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  characterIndex: number
  beforeSlot?: React.ReactNode
}

const Character = React.forwardRef<HTMLDivElement, CharacterProps>(
  ({ characterIndex, className, beforeSlot, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative h-50',
          characterIndex === 0 && 'aspect-[1855/calc(1830*1.25)]',
          characterIndex === 1 && 'aspect-[1123/1415]',
          props.onClick && 'cursor-pointer',
          className,
        )}
        {...props}
      >
        {beforeSlot}
        <div
          className='absolute inset-0 bg-contain bg-bottom bg-no-repeat'
          style={{
            backgroundImage: `url(${CHARACTER_IMAGES[characterIndex]})`,
          }}
        ></div>
        <GunCharacter
          className={cn(
            'absolute',
            characterIndex === 0 && 'top-0 left-[30%] aspect-[1/2.3] w-[45%]',
            characterIndex === 1 &&
              'top-[15%] left-[7%] aspect-[1/1.7] w-[30%]',
          )}
        />
      </div>
    )
  },
)

export { Character }
