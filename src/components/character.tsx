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
    const showGun = !['anime-1', 'anime-2'].includes(characterName)

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
            'absolute inset-0',
            'scale-75 -rotate-y-180 bg-contain transition-all duration-500 backface-hidden',
            isFront && 'scale-100 rotate-y-0',
          )}
        >
          <div
            className='absolute inset-0 z-1 bg-contain bg-bottom bg-no-repeat'
            style={{
              backgroundImage: `url(${CHARACTER_LIST[characterName]['front']})`,
            }}
          ></div>
          <GunCharacter
            className={cn(
              'absolute z-1',
              characterName === 'nubcat' &&
                'top-0 left-[30%] aspect-[1/2.3] w-[40%]',
              characterName === 'mickey' &&
                'top-[15%] left-[16%] aspect-[1/1.7] w-[26%]',
              characterName === 'fatty' &&
                'top-[5%] left-[15%] aspect-[1/2.4] w-[22%] rotate-11',
              characterName === 'anime-1' &&
                'top-[25%] left-[12%] aspect-[1/2] w-[11%]',
              characterName === 'anime-2' &&
                'top-[16%] left-[34%] aspect-[1/1.9] w-[13%]',
            )}
            gunHandleRef={frontGunHandleRef}
            showGun={showGun}
          />
        </div>
        <div
          className={cn(
            'absolute inset-0',
            'scale-75 -rotate-y-180 transition-all duration-500 backface-hidden',
            isBack && 'scale-100 rotate-y-0',
          )}
        >
          <div
            className='absolute inset-0 z-2 bg-contain bg-bottom bg-no-repeat'
            style={{
              backgroundImage: `url(${CHARACTER_LIST[characterName]['back']})`,
            }}
          ></div>
          <GunCharacter
            className={cn(
              'absolute z-1 aspect-[1/1.7]',
              characterName === 'nubcat' && 'right-[6%] w-[20%]',
              characterName === 'mickey' && 'top-[17%] right-[22%] w-[10%]',
              characterName === 'fatty' && 'right-[15%] w-[10%]',
              characterName === 'anime-1' && 'top-[20%] left-[29%] w-[7%]',
              characterName === 'anime-2' && 'top-[17%] right-[34%] w-[7%]',
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
