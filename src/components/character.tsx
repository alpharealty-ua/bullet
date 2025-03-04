import React from 'react'

import { cn } from '@/lib/utils'
import { CHARACTER_LIST, CharacterName } from '@/lib/constants'
import { GunCharacter, GunCharacterProps } from './character-gun'

interface CharacterProps
  extends React.HtmlHTMLAttributes<HTMLDivElement>,
    Pick<GunCharacterProps, 'gunHandleRef'> {
  characterName: CharacterName
  type: 'enemy' | 'player'
  beforeSlot?: React.ReactNode
}

const Character = React.forwardRef<HTMLDivElement, CharacterProps>(
  (
    { characterName, className, beforeSlot, gunHandleRef, type, ...props },
    ref,
  ) => {
    const isEnemy = type === 'enemy'
    const isPlayer = type === 'player'
    const isNubcat = characterName === 'nubcat'
    const isMikey = characterName === 'mickey'
    const isFatty = characterName === 'fatty'

    return (
      <div
        ref={ref}
        className={cn(
          'relative aspect-square',
          isEnemy && isNubcat && 'aspect-[1855/calc(1830*1.25)]',
          isEnemy && isMikey && 'aspect-[1123/1415]',
          isEnemy && isFatty && 'aspect-[285/246]',
          isPlayer && isNubcat && 'aspect-[499/544]',
          isPlayer && isMikey && 'aspect-[185/274]',
          isPlayer && isFatty && 'aspect-[190/220]',
          props.onClick && 'cursor-pointer',
          className,
        )}
        {...props}
      >
        {beforeSlot}
        <div
          className='absolute inset-0 bg-contain bg-bottom bg-no-repeat'
          style={{
            backgroundImage: `url(${CHARACTER_LIST[characterName][type]})`,
          }}
        ></div>
        {type === 'enemy' && (
          <GunCharacter
            className={cn(
              'absolute right-0 left-0 max-h-full',
              characterName === 'nubcat' &&
                'top-0 left-[30%] aspect-[1/2.3] w-[45%]',
              characterName === 'mickey' &&
                'top-[15%] left-[7%] aspect-[1/1.7] w-[30%]',
              characterName === 'fatty' &&
                'top-[0%] left-[15%] aspect-[1/2.4] w-[22%] rotate-11',
            )}
            gunHandleRef={gunHandleRef}
          />
        )}
      </div>
    )
  },
)

export { Character }
