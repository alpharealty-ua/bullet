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
}

// A function cva need for work prettier-plugin-tailwindcss
const cva = (className: string) => className
const positionStylesMap = {
  gun: {
    front: {
      nubcat: cva('top-0 left-[30%] aspect-[1/2.3] w-[40%]'),
      mickey: cva('top-[13%] left-[14%] aspect-[1/1.8] w-[29.5%]'),
      fatty: cva('top-[6%] left-[15%] aspect-[1/2.4] w-[22.5%] rotate-12'),
      'anime-1': cva('top-[24%] left-[10%] aspect-[1/1.82] w-[14.5%]'),
      'anime-2': cva('top-[15%] left-[33%] aspect-[1/2.1] w-[14%]'),
      daisy: cva('top-[9%] left-[18%] aspect-[1/2] w-[17.5%]'),
    },
    back: {
      nubcat: cva('right-[6%] w-[20%]'),
      mickey: cva('top-[17%] right-[22%] w-[10%]'),
      fatty: cva('right-[14%] w-[14%] -rotate-8'),
      'anime-1': cva('top-[20%] left-[30%] w-[6.5%]'),
      'anime-2': cva('top-[17%] right-[33.5%] w-[6%]'),
      daisy: cva('top-[0%] right-[11%] w-[14%]'),
    },
  },
  hand: {
    front: {
      nubcat: cva('bottom-[-10%] left-[38.5%]'),
      mickey: cva('h-[80%]'),
      fatty: cva('left-[40%] h-[64%]'),
      'anime-1': cva('h-[65%]'),
      'anime-2': cva('h-[65%]'),
      daisy: cva('top-[30%] bottom-auto left-[22%] h-[115%]'),
    },
  },
} satisfies {
  gun: Record<CharacterType, Record<CharacterName, string>>
  hand: Record<Exclude<CharacterType, 'back'>, Record<CharacterName, string>>
}

const GunCharacter = React.forwardRef<HTMLDivElement, GunCharacterProps>(
  (
    { className, gunHandleRef, characterName, characterType, ...props },
    ref,
  ) => {
    const playSound = useSettingsStore(({ playSound }) => playSound)
    const gunRef = useRef<HTMLDivElement>(null)
    const rotateRef = useRef(0)
    const [showShot, setShowShot] = useState(false)
    const isBack = characterType === 'back'

    const images = IMAGES.character[characterName]

    const shot = useShot(playSound, setShowShot)

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

      await playSound('triggerpull')
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
            positionStylesMap.gun[characterType][characterName],
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
              'absolute bottom-0 left-1/2 aspect-[1632/1830] h-[90%] -translate-x-1/2 bg-contain bg-center bg-no-repeat',
              isBack && 'opacity-0',
              characterType === 'front' &&
                positionStylesMap.hand[characterType][characterName],
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
              isBack && 'opacity-0',
            )}
            data-chamber
          >
            <div
              className={'absolute inset-0 bg-contain bg-center bg-no-repeat'}
              style={{
                backgroundImage: `url(${IMAGES.gun.chamber})`,
              }}
              data-chamber-rotate
            ></div>
          </div>
          <div
            className={cn(
              'pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat',
              isBack && 'opacity-0',
            )}
            style={{
              backgroundImage: `url(${IMAGES.gun.body})`,
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
                style={{ backgroundImage: `url(${IMAGES.gun.shot1})` }}
              ></div>
              <div
                className={cn(
                  'absolute inset-0 scale-600 bg-contain bg-center bg-no-repeat',
                  'zoom-in fade-in fill-mode-backwards animate-in delay-250 duration-150 ease-linear',
                )}
                style={{ backgroundImage: `url(${IMAGES.gun.shot2})` }}
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
              style={{ backgroundImage: `url(${IMAGES.gun.shot3})` }}
            ></div>
          ),
          document.body,
        )}
      </>
    )
  },
)

export { GunCharacter }
