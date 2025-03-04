import React from 'react'

import { cn } from '@/lib/utils'
import { CHARACTER_LIST, CharacterName, CharacterType } from '@/lib/constants'
import { GunCharacter, GunCharacterProps } from './character-gun'

interface CharacterProps
  extends React.HtmlHTMLAttributes<HTMLDivElement>,
    Pick<GunCharacterProps, 'gunHandleRef'> {
  characterName: CharacterName
  type: CharacterType
  beforeSlot?: React.ReactNode
}

const Character = React.forwardRef<HTMLDivElement, CharacterProps>(
  (
    { characterName, className, beforeSlot, gunHandleRef, type, ...props },
    ref,
  ) => {
    const isFront = type === 'front'
    const isBack = type === 'back'

    return (
      <div
        ref={ref}
        className={cn(
          'relative aspect-square transition-all',
          props.onClick && 'cursor-pointer',
          className,
        )}
        {...props}
      >
        {beforeSlot}
        <div
          className={cn(
            'absolute inset-0 scale-75 -rotate-y-180 bg-contain bg-bottom bg-no-repeat opacity-0 transition-all duration-500',
            isFront && 'scale-100 rotate-y-0 opacity-100',
          )}
          style={{
            backgroundImage: `url(${CHARACTER_LIST[characterName]['front']})`,
          }}
        >
          <GunCharacter
            className={cn(
              'absolute right-0 left-0 max-h-full',
              characterName === 'nubcat' &&
                'top-0 left-[30%] aspect-[1/2.3] w-[40%]',
              characterName === 'mickey' &&
                'top-[15%] left-[13%] aspect-[1/1.7] w-[30%]',
              characterName === 'fatty' &&
                'top-[5%] left-[15%] aspect-[1/2.4] w-[22%] rotate-11',
            )}
            gunHandleRef={gunHandleRef}
          />
        </div>
        <div
          className={cn(
            'absolute inset-0 scale-75 -rotate-y-180 bg-contain bg-bottom bg-no-repeat opacity-0 transition-all duration-500',
            isBack && 'scale-100 rotate-y-0 opacity-100',
          )}
          style={{
            backgroundImage: `url(${CHARACTER_LIST[characterName]['back']})`,
          }}
        ></div>
      </div>
    )
  },
)

export { Character }
