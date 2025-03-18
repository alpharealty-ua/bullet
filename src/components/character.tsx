import React, { useImperativeHandle, useRef, useState } from 'react'
import { IoSkull } from 'react-icons/io5'

import { cn } from '@/lib/utils'
import { CHARACTER_LIST, CharacterName, CharacterType } from '@/lib/constants'
import { GunCharacter, GunHandle } from '@/components/character-gun'

interface CharacterProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  characterName: CharacterName
  type: CharacterType
  beforeSlot?: React.ReactNode
  characterHandleRef?: React.ForwardedRef<CharacterHandle>
}

export interface CharacterHandle {
  dead: () => Promise<void>
  reset: () => Promise<void>
  frontGunHandleRef?: React.RefObject<GunHandle>
  backGunHandleRef?: React.RefObject<GunHandle>
}

const Character = React.forwardRef<HTMLDivElement, CharacterProps>(
  (
    {
      characterName,
      className,
      beforeSlot,
      characterHandleRef,
      type,
      ...props
    },
    ref,
  ) => {
    const frontGunHandleRef = useRef<GunHandle>(null)
    const backGunHandleRef = useRef<GunHandle>(null)
    const [isDead, setIsDead] = useState(false)
    const isFront = type === 'front'
    const isBack = type === 'back'
    const showGun = !['anime-1', 'anime-2'].includes(characterName)

    useImperativeHandle(characterHandleRef, () => {
      return {
        dead: async () => {
          setIsDead(true)
        },
        reset: async () => {
          setIsDead(false)
        },
        frontGunHandleRef,
        backGunHandleRef,
      }
    })

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
              characterName === 'fatty' && 'right-[16%] w-[10%] -rotate-20',
              characterName === 'anime-1' && 'top-[20%] left-[29%] w-[7%]',
              characterName === 'anime-2' && 'top-[17%] right-[34%] w-[7%]',
            )}
            gunHandleRef={backGunHandleRef}
            showGun={false}
          />
        </div>
        {isDead && (
          <div
            className={cn(
              'absolute -top-10 left-1/2 flex -translate-x-1/2 flex-col items-center justify-center',
              'fade-in animate-in zoom-in-80 duration-500',
            )}
          >
            <div className='text-3xl'>Dead</div>
            <IoSkull className='text-red relative mx-auto text-9xl' />
          </div>
        )}
      </div>
    )
  },
)

export { Character }
