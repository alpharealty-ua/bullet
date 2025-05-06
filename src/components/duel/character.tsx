import React, { useImperativeHandle, useRef, useState } from 'react'
import { IoSkull } from 'react-icons/io5'
import { ImExit } from 'react-icons/im'
import { FaCrown } from 'react-icons/fa'

import { cn } from '@/lib/utils'
import { CHARACTER_LIST, CharacterName, CharacterType } from '@/lib/constants'
import { GunCharacter, GunHandle } from '@/components/duel/character-gun'
import { PlayerInfo, PlayerInfoProps } from '@/components/duel/player-info'

export type CharacterState = {
  characterState: 'eliminated' | 'alive' | 'left' | 'winner'
  showInfo: boolean
}

const initState = {
  characterState: 'alive',
  showInfo: true,
} satisfies CharacterState

interface CharacterProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  name?: CharacterName
  type: CharacterType
  playerInfoProps?: Omit<PlayerInfoProps, 'visible'>
  beforeSlot?: React.ReactNode
  characterHandleRef?: React.ForwardedRef<CharacterHandle>
}

export interface CharacterHandle {
  updateState: (state: Partial<CharacterState>) => Promise<void>
  toggleInfo: () => Promise<void>
  reset: () => Promise<void>
  frontGunHandleRef?: React.RefObject<GunHandle>
  backGunHandleRef?: React.RefObject<GunHandle>
}

const Character = React.forwardRef<HTMLDivElement, CharacterProps>(
  (
    {
      name = 'fatty',
      className,
      beforeSlot,
      playerInfoProps,
      characterHandleRef,
      type,
      ...props
    },
    ref,
  ) => {
    const frontGunHandleRef = useRef<GunHandle>(null)
    const backGunHandleRef = useRef<GunHandle>(null)
    const [{ characterState, showInfo }, setState] =
      useState<CharacterState>(initState)
    const characterImages = CHARACTER_LIST[name] ?? CHARACTER_LIST.fatty
    const imagesNotFound = !CHARACTER_LIST[name]
    const frontImage = characterImages.front
    const backImage = characterImages.back

    useImperativeHandle(characterHandleRef, () => {
      return {
        updateState: async (state: Partial<CharacterState>) => {
          setState((p) => ({ ...p, ...state }))
        },
        toggleInfo: async () =>
          setState((p) => ({ ...p, showInfo: !p.showInfo })),
        reset: async () => {
          setState(initState)
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
        {playerInfoProps && (
          <PlayerInfo {...playerInfoProps} visible={showInfo} />
        )}
        <div
          className={cn(
            'absolute inset-0',
            'scale-75 -rotate-y-180 bg-contain transition-all duration-500 backface-hidden',
            type === 'front' && 'scale-100 rotate-y-0',
          )}
        >
          <div
            className={cn(
              'absolute inset-0 bg-contain bg-bottom bg-no-repeat',
              imagesNotFound && 'opacity-50',
            )}
            style={{
              backgroundImage: `url(${frontImage})`,
            }}
          ></div>
          {imagesNotFound && (
            <div className='relative z-3 flex h-full items-center justify-center text-center'>
              Front image not&nbsp;found
            </div>
          )}
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
            className={cn(
              'absolute inset-0 z-2 bg-contain bg-bottom bg-no-repeat',
              imagesNotFound && 'opacity-50',
            )}
            style={{
              backgroundImage: `url(${backImage})`,
            }}
          ></div>
          {imagesNotFound && (
            <div className='relative z-3 flex h-full items-center justify-center text-center'>
              Back image not&nbsp;found
            </div>
          )}
          <GunCharacter
            characterName={name}
            characterType={'back'}
            gunHandleRef={backGunHandleRef}
          />
        </div>
        {characterState !== 'alive' && (
          <div
            className={cn(
              'absolute -top-10 left-1/2 flex -translate-x-1/2 flex-col items-center justify-center gap-2',
              'fade-in animate-in zoom-in-80 duration-500',
            )}
          >
            {characterState === 'eliminated' && (
              <>
                <div className='text-3xl'>Dead</div>
                <IoSkull className='text-red relative mx-auto text-9xl' />
              </>
            )}
            {characterState === 'left' && (
              <>
                <div className='text-3xl'>Left</div>
                <ImExit className='text-red relative mx-auto text-9xl' />
              </>
            )}
            {characterState === 'winner' && (
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
