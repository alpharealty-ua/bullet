import React, { useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import mergeRefs from 'merge-refs'

import { CharacterName, CharacterType, IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/store/settings.store'
import { Click } from '@/components/guns/click'
import { useClick } from '@/components/guns/use-click'
import { useSpin } from '@/components/guns/use-spin'
import { useShot } from '@/components/guns/use-shot'

export interface GunHandle {
  spin: (duration?: number) => Promise<void>
  trigger: () => Promise<void>
  click: () => Promise<void>
  shot: () => Promise<void>
}

export interface GunCharacterProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  gunHandleRef?: React.ForwardedRef<GunHandle>
  characterName: CharacterName
  characterType: CharacterType
  hideGun?: boolean
}

const imagesMap = {
  fatty: {
    hand: IMAGES.gunhandcharacterfatty,
    finger: IMAGES.gunfingercharacterfatty,
  },
  mickey: {
    hand: IMAGES.gunhandcharactermickey,
    finger: IMAGES.gunfingercharactermickey,
  },
  nubcat: {
    hand: IMAGES.gunhandcharacternubcat,
    finger: IMAGES.gunfingercharacternubcat,
  },
  'anime-1': {
    hand: IMAGES.gunhandcharacteranime,
    finger: IMAGES.gunfingercharacteranime,
  },
  'anime-2': {
    hand: IMAGES.gunhandcharacteranime,
    finger: IMAGES.gunfingercharacteranime,
  },
} satisfies Record<CharacterName, { hand: string; finger: string } | null>

// A function cva need for work prettier-plugin-tailwindcss
const cva = (className: string) => className
const positionStylesMap = {
  front: {
    nubcat: cva('top-0 left-[30%] aspect-[1/2.3] w-[40%]'),
    mickey: cva('top-[13%] left-[14%] aspect-[1/1.8] w-[29.5%]'),
    fatty: cva('top-[6%] left-[15%] aspect-[1/2.4] w-[22.5%] rotate-12'),
    'anime-1': cva('top-[24%] left-[10%] aspect-[1/1.82] w-[14.5%]'),
    'anime-2': cva('top-[15%] left-[33%] aspect-[1/2.1] w-[14%]'),
  },
  back: {
    nubcat: cva('right-[6%] w-[20%]'),
    mickey: cva('top-[17%] right-[22%] w-[10%]'),
    fatty: cva('right-[14%] w-[14%] -rotate-8'),
    'anime-1': cva('top-[20%] left-[30%] w-[6.5%]'),
    'anime-2': cva('top-[17%] right-[33.5%] w-[6%]'),
  },
} satisfies Record<CharacterType, Record<CharacterName, string>>

const GunCharacter = React.forwardRef<HTMLDivElement, GunCharacterProps>(
  (
    {
      className,
      gunHandleRef,
      characterName,
      characterType,
      hideGun = false,
      ...props
    },
    ref,
  ) => {
    const playAudio = useSettingsStore(({ playAudio }) => playAudio)
    const gunRef = useRef<HTMLDivElement>(null)
    const rotateRef = useRef(0)
    const [showShot, setShowShot] = useState(false)
    const isFront = characterType === 'front'
    const isNubcat = characterName === 'nubcat'
    const isMickey = characterName === 'mickey'
    const isFatty = characterName === 'fatty'
    const isAnime1 = characterName === 'anime-1'
    const isAnime2 = characterName === 'anime-2'

    const images = imagesMap[characterName]

    const shot = useShot(playAudio, setShowShot)

    const spin = useSpin(gunRef, rotateRef)

    const trigger = async () => {
      const fingerEl = gunRef.current?.querySelector('[data-finger]')

      if (fingerEl == null) {
        return
      }

      fingerEl.classList.add('is-trigger')
      await new Promise((resolve) =>
        fingerEl.addEventListener('transitionend', resolve, { once: true }),
      )
      fingerEl.classList.remove('is-trigger')

      await playAudio('triggerpull')
    }

    const click = useClick(gunRef)

    useImperativeHandle(gunHandleRef, () => ({
      shot,
      spin,
      trigger,
      click,
    }))

    return (
      <>
        <div
          ref={mergeRefs(ref, gunRef)}
          className={cn(
            'absolute z-1 aspect-[1/1.5]',
            positionStylesMap[characterType][characterName],
            className,
          )}
          {...props}
        >
          <Click
            leftClick={{ className: 'w-[80%]' }}
            rightClick={{ className: 'w-[80%]' }}
          />
          <div
            className={cn(
              'absolute bottom-[-10%] left-[40%] aspect-[1632/1830] h-[90%] -translate-x-1/2 bg-contain bg-center bg-no-repeat',
              hideGun && 'opacity-0',
              isFront && isNubcat && '',
              isFront && isMickey && 'bottom-[0%] left-1/2 h-[80%]',
              isFront && isFatty && 'bottom-0 h-[64%]',
              isFront && isAnime1 && 'bottom-0 left-1/2 h-[65%]',
              isFront && isAnime2 && 'bottom-0 left-1/2 h-[65%]',
            )}
            style={{
              backgroundImage: `url(${images.hand})`,
            }}
            data-hand
          >
            <div
              className={cn(
                'absolute top-[12%] left-[15%] aspect-square w-[60%] bg-contain bg-center bg-no-repeat transition-all',
                'duration-100 [&.is-trigger]:-rotate-10',
              )}
              style={{
                backgroundImage: `url(${images.finger})`,
              }}
              data-finger
            ></div>
          </div>
          <div
            className={cn(
              'absolute top-[10%] right-0 left-0 aspect-square',
              hideGun && 'opacity-0',
            )}
            data-chamber
          >
            <div
              className={'absolute inset-0 bg-contain bg-center bg-no-repeat'}
              style={{
                backgroundImage: `url(${IMAGES.gunchambercharacter})`,
              }}
              data-chamber-rotate
            ></div>
          </div>
          <div
            className={cn(
              'pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat',
              hideGun && 'opacity-0',
            )}
            style={{
              backgroundImage: `url(${IMAGES.gunbodycharacter})`,
            }}
            data-body
          ></div>
          {showShot && (
            <div className='relative z-5 mx-auto aspect-square h-[35%]'>
              <div
                className={cn(
                  'absolute inset-0 scale-300 bg-contain bg-center bg-no-repeat',
                  'zoom-in-50 fade-in fill-mode-backwards animate-in delay-100 duration-150 ease-linear',
                )}
                style={{ backgroundImage: `url(${IMAGES.shot1})` }}
              ></div>
              <div
                className={cn(
                  'absolute inset-0 scale-600',
                  'zoom-in fade-in fill-mode-backwards animate-in bg-contain bg-center bg-no-repeat delay-250 duration-150 ease-linear',
                )}
                style={{ backgroundImage: `url(${IMAGES.shot2})` }}
              ></div>
            </div>
          )}
        </div>
        {createPortal(
          showShot && (
            <div
              className={cn(
                'fixed inset-0 z-50 mx-auto max-w-[var(--width)]',
                'fill-mode-both fade-in animate-in bg-cover bg-center bg-no-repeat delay-350 duration-150 ease-linear',
              )}
              style={{ backgroundImage: `url(${IMAGES.shot3})` }}
            ></div>
          ),
          document.body,
        )}
      </>
    )
  },
)

export { GunCharacter }
