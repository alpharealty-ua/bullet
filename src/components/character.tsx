import React, { useImperativeHandle, useRef, useState } from 'react'
import { IoSkull } from 'react-icons/io5'
import { ImExit } from 'react-icons/im'
import { FaCrown } from 'react-icons/fa'

import { cn } from '@/lib/utils'
import { CHARACTER_LIST, CharacterName, CharacterType } from '@/lib/constants'
import { GunCharacter, GunHandle } from '@/components/character-gun'

export type CharacterState = 'eliminated' | 'alive' | 'left' | 'winner'
interface CharacterProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  name: CharacterName
  type: CharacterType
  beforeSlot?: React.ReactNode
  characterHandleRef?: React.ForwardedRef<CharacterHandle>
}

export interface CharacterHandle {
  updateState: (state: CharacterState) => Promise<void>
  reset: () => Promise<void>
  frontGunHandleRef?: React.RefObject<GunHandle>
  backGunHandleRef?: React.RefObject<GunHandle>
}

const Character = React.forwardRef<HTMLDivElement, CharacterProps>(
  (
    { name, className, beforeSlot, characterHandleRef, type, ...props },
    ref,
  ) => {
    const frontGunHandleRef = useRef<GunHandle>(null)
    const backGunHandleRef = useRef<GunHandle>(null)
    const [state, setState] = useState<CharacterState>('alive')

    useImperativeHandle(characterHandleRef, () => {
      return {
        updateState: async (state: CharacterState) => {
          setState(state)
        },
        reset: async () => {
          setState('alive')
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
            type === 'front' && 'scale-100 rotate-y-0',
          )}
        >
          <div
            className='absolute inset-0 bg-contain bg-bottom bg-no-repeat'
            style={{
              backgroundImage: `url(${CHARACTER_LIST[name]['front']})`,
            }}
          ></div>
          <GunCharacter
            characterName={name}
            characterType={'front'}
            gunHandleRef={frontGunHandleRef}
          />
        </div>
        <div
          className={cn(
            'absolute inset-0',
            'scale-75 -rotate-y-180 transition-all duration-500 backface-hidden',
            type === 'back' && 'scale-100 rotate-y-0',
          )}
        >
          <div
            className='absolute inset-0 z-2 bg-contain bg-bottom bg-no-repeat'
            style={{
              backgroundImage: `url(${CHARACTER_LIST[name]['back']})`,
            }}
          ></div>
          <GunCharacter
            characterName={name}
            characterType={'back'}
            gunHandleRef={backGunHandleRef}
            hideGun={true}
          />
        </div>
        {state !== 'alive' && (
          <div
            className={cn(
              'absolute -top-10 left-1/2 flex -translate-x-1/2 flex-col items-center justify-center gap-2',
              'fade-in animate-in zoom-in-80 duration-500',
            )}
          >
            {state === 'eliminated' && (
              <>
                <div className='text-3xl'>Dead</div>
                <IoSkull className='text-red relative mx-auto text-9xl' />
              </>
            )}
            {state === 'left' && (
              <>
                <div className='text-3xl'>Left</div>
                <ImExit className='text-red relative mx-auto text-9xl' />
              </>
            )}
            {state === 'winner' && (
              <>
                <div className='text-3xl'>Winner</div>
                <FaCrown className='text-green relative mx-auto text-9xl' />
              </>
            )}
          </div>
        )}
      </div>
    )
  },
)

export { Character }
