import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import mergeRefs from 'merge-refs'

import { images } from '@/lib/constants'
import { cn, waitEndAudio } from '@/lib/utils'
import { useSettingsStore } from '@/store/settings.store'
import { Click } from './guns/click'
import { useClick } from './guns/use-click'

export type GunHandle = {
  spin: (duration?: number) => Promise<void>
  click: () => Promise<void>
  shot: () => Promise<void>
}

export interface GunCharacterProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  gunHandleRef?: React.ForwardedRef<GunHandle>
}

const GunCharacter = React.forwardRef<HTMLDivElement, GunCharacterProps>(
  ({ className, gunHandleRef, ...props }, ref) => {
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

    // TODO: REUSE
    const spin = useCallback(async (duration = 200): Promise<void> => {
      const gunDom = gunRef.current

      if (gunDom === null) {
        return
      }

      const chamberDom = gunDom.querySelector(
        '[data-chamber]',
      ) as HTMLDivElement

      if (chamberDom === null) {
        return
      }

      return new Promise<void>((resolve) => {
        const transitionend = (event: TransitionEvent) => {
          if (event.propertyName !== 'rotate') {
            return
          }

          chamberDom.style.transitionDuration = ``
          chamberDom.removeEventListener('transitionend', transitionend)
          resolve()
        }

        chamberDom.style.rotate = (rotateRef.current += 60) + 'deg'
        chamberDom.style.transitionDuration = `${duration}ms`
        chamberDom.addEventListener('transitionend', transitionend)
      })
    }, [])

    const click = useClick(gunRef)

    useImperativeHandle(gunHandleRef, () => ({
      spin,
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
            className='absolute top-[10%] right-0 left-0 aspect-square bg-contain bg-center bg-no-repeat'
            style={{
              backgroundImage: `url(${images.gunchambercharacter})`,
            }}
            data-chamber
          ></div>
          <div
            className='pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat'
            style={{
              backgroundImage: `url(${images.gunbodycharacter})`,
            }}
            data-body
          ></div>
          {showShot && (
            <>
              <div className='relative top-[7%] left-1/2 z-5 aspect-square w-[53%] -translate-x-1/2'>
                <div
                  className={cn(
                    'absolute inset-0 scale-200 opacity-0',
                    'zoom-in-50 fade-in fill-mode-backwards bg-no-repea animate-[shot] bg-cover bg-center duration-200 ease-linear',
                  )}
                  style={{ backgroundImage: `url(${images.shot1})` }}
                ></div>
                <div
                  className={cn(
                    'absolute inset-0 scale-600 opacity-0',
                    'zoom-in fade-in fill-mode-backwards animate-[shot] bg-cover bg-center bg-no-repeat delay-200 duration-200 ease-linear',
                  )}
                  style={{ backgroundImage: `url(${images.shot2})` }}
                ></div>
              </div>
            </>
          )}
        </div>
        {createPortal(
          showShot && (
            <div
              className={cn(
                'fixed inset-0 z-50 mx-auto max-w-[var(--width)] opacity-0',
                'fill-mode-both fade-in animate-[shot] bg-cover bg-center bg-no-repeat delay-400 duration-200 ease-linear',
              )}
              style={{ backgroundImage: `url(${images.shot3})` }}
            ></div>
          ),
          document.body,
        )}
      </>
    )
  },
)

export { GunCharacter }
