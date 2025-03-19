import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import mergeRefs from 'merge-refs'

import { IMAGES } from '@/lib/constants'
import { cn, waitEndAudio } from '@/lib/utils'
import { useSettingsStore } from '@/store/settings.store'
import { Click } from '@/components/guns/click'
import { useClick } from '@/components/guns/use-click'
import { useSpin } from '@/components/guns/use-spin'

export interface GunHandle {
  spin: (duration?: number) => Promise<void>
  trigger: () => Promise<void>
  click: () => Promise<void>
  shot: () => Promise<void>
}

export interface GunCharacterProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  gunHandleRef?: React.ForwardedRef<GunHandle>
  hideGun?: boolean
}

const GunCharacter = React.forwardRef<HTMLDivElement, GunCharacterProps>(
  ({ className, gunHandleRef, hideGun = false, ...props }, ref) => {
    const playAudio = useSettingsStore(({ playAudio }) => playAudio)
    const gunRef = useRef<HTMLDivElement>(null)
    const rotateRef = useRef(0)
    const [showShot, setShowShot] = useState(false)

    const shot = useCallback(async () => {
      const gunShotAudio = await playAudio('gunshot')

      setShowShot(true)

      await waitEndAudio(gunShotAudio)

      setShowShot(false)
    }, [playAudio])

    const spin = useSpin(gunRef, rotateRef)

    const click = useClick(gunRef)

    useImperativeHandle(gunHandleRef, () => ({
      spin,
      trigger: async () => {
        const gunDom = gunRef.current

        if (gunDom === null) {
          return
        }

        const fingerDom = gunDom.querySelector('[data-finger]')

        if (fingerDom === null) {
          return
        }

        fingerDom.classList.add('is-trigger')
        await new Promise((resolve) =>
          fingerDom.addEventListener('transitionend', resolve, { once: true }),
        )
        fingerDom.classList.remove('is-trigger')

        void playAudio('triggerpull')
      },
      shot,
      click,
    }))

    return (
      <>
        <div
          ref={mergeRefs(ref, gunRef)}
          className={cn('relative aspect-[1/1.95]', className)}
          {...props}
        >
          <Click
            leftClick={{
              className: 'w-[80%]',
            }}
            rightClick={{
              className: 'w-[80%]',
            }}
          />
          <div
            className={cn(
              'absolute bottom-0 left-[-10%] aspect-square w-[140%] bg-contain bg-center bg-no-repeat',
              hideGun && 'opacity-0',
            )}
            style={{
              backgroundImage: `url(${IMAGES.gunhandcharacter})`,
            }}
            data-hand
          >
            <div
              className={cn(
                'absolute top-[10%] left-[10%] aspect-square w-[60%] bg-contain bg-center bg-no-repeat transition-all',
                'duration-100 [&.is-trigger]:-rotate-10',
              )}
              style={{
                backgroundImage: `url(${IMAGES.gunfingercharacter})`,
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
            <div className='relative top-0 right-0 left-0 z-5 mx-auto aspect-square h-[35%]'>
              <div
                className={cn(
                  'absolute inset-0 scale-300 bg-cover bg-center',
                  'zoom-in-50 fade-in fill-mode-backwards animate-in bg-no-repeat delay-100 duration-150 ease-linear',
                )}
                style={{ backgroundImage: `url(${IMAGES.shot1})` }}
              ></div>
              <div
                className={cn(
                  'absolute inset-0 scale-600',
                  'zoom-in fade-in fill-mode-backwards animate-in bg-cover bg-center bg-no-repeat delay-250 duration-150 ease-linear',
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
