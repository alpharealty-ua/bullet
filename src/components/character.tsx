import React from 'react'

import { cn } from '@/lib/utils'
import { CHARACTER_LIST, CharacterName, CharacterType } from '@/lib/constants'
import { GunCharacter, GunHandle } from '@/components/character-gun'

interface CharacterProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  characterName: CharacterName
  type: CharacterType
  beforeSlot?: React.ReactNode
  frontGunHandleRef?: React.ForwardedRef<GunHandle>
  backGunHandleRef?: React.ForwardedRef<GunHandle>
}

const Character = React.forwardRef<HTMLDivElement, CharacterProps>(
  (
    {
      characterName,
      className,
      beforeSlot,
      frontGunHandleRef,
      backGunHandleRef,
      type,
      ...props
    },
    ref,
  ) => {
    const isFront = type === 'front'
    const isBack = type === 'back'
    const hasGun = ['nubcat', 'mickey', 'fatty'].includes(characterName)

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
            'absolute inset-0 scale-75 -rotate-y-180 bg-contain bg-bottom bg-no-repeat transition-all duration-500 backface-hidden',
            isFront && 'scale-100 rotate-y-0',
          )}
          style={{
            backgroundImage: `url(${CHARACTER_LIST[characterName]['front']})`,
          }}
        >
          {hasGun && (
            <GunCharacter
              className={cn(
                'absolute right-0 left-0 max-h-full',
                characterName === 'nubcat' &&
                  'top-0 left-[30%] aspect-[1/2.3] w-[40%]',
                characterName === 'mickey' &&
                  'top-[15%] left-[16%] aspect-[1/1.7] w-[26%]',
                characterName === 'fatty' &&
                  'top-[5%] left-[15%] aspect-[1/2.4] w-[22%] rotate-11',
              )}
              gunHandleRef={frontGunHandleRef}
              showGun={true}
            />
          )}
        </div>
        <div
          className={cn(
            'absolute inset-0 scale-75 -rotate-y-180 bg-contain bg-bottom bg-no-repeat transition-all duration-500 backface-hidden',
            isBack && 'scale-100 rotate-y-0',
          )}
          style={{
            backgroundImage: `url(${CHARACTER_LIST[characterName]['back']})`,
          }}
        >
          <GunCharacter
            className={cn(
              'absolute right-[6%] aspect-[1/1.7] max-h-full w-[20%]',
              characterName === 'nubcat' && '',
              characterName === 'mickey' && '',
              characterName === 'fatty' && '',
            )}
            gunHandleRef={backGunHandleRef}
            showGun={false}
          />
        </div>
      </div>
    )
  },
)

export { Character }
