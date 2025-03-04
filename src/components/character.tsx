import React from 'react'

import { cn } from '@/lib/utils'
import { Character as CharacterType } from '@/lib/constants'
import { GunCharacter, GunCharacterProps } from './character-gun'

interface CharacterProps
  extends React.HtmlHTMLAttributes<HTMLDivElement>,
    Pick<GunCharacterProps, 'gunHandleRef'> {
  character: CharacterType
  beforeSlot?: React.ReactNode
}

const Character = React.forwardRef<HTMLDivElement, CharacterProps>(
  ({ character, className, beforeSlot, gunHandleRef, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative aspect-square h-50',
          character.name === 'nubcat' && 'aspect-[1855/calc(1830*1.25)]',
          character.name === 'mickey' && 'aspect-[1123/1415]',
          character.name === 'fatty' && 'aspect-[285/246]',
          props.onClick && 'cursor-pointer',
          className,
        )}
        {...props}
      >
        {beforeSlot}
        <div
          className='absolute inset-0 bg-contain bg-bottom bg-no-repeat'
          style={{
            backgroundImage: `url(${character.image})`,
          }}
        ></div>
        <GunCharacter
          className={cn(
            'absolute right-0 left-0 max-h-full',
            character.name === 'nubcat' &&
              'top-0 left-[30%] aspect-[1/2.3] w-[45%]',
            character.name === 'mickey' &&
              'top-[15%] left-[7%] aspect-[1/1.7] w-[30%]',
            character.name === 'fatty' &&
              'top-[0%] left-[15%] aspect-[1/2.4] w-[22%] rotate-11',
          )}
          gunHandleRef={gunHandleRef}
        />
      </div>
    )
  },
)

export { Character }
