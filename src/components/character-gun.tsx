import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import mergeRefs from 'merge-refs'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

export interface GunCharacterProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  gunHandleRef?: React.ForwardedRef<{
    spin: (duration?: number) => Promise<void>
    shot: () => void
  }>
}

const GunCharacter = React.forwardRef<HTMLDivElement, GunCharacterProps>(
  ({ className, gunHandleRef, ...props }, ref) => {
    const gunRef = useRef<HTMLDivElement>(null)
    const rotateRef = useRef(0)

    useEffect(() => {
      const gunDom = gunRef.current

      if (gunDom === null) {
        return
      }

      const chamberDom = gunDom.querySelector('[data-chamber]')
      const bodyDom = gunDom.querySelector('[data-body]')

      if (!(chamberDom && bodyDom)) {
        return
      }
    }, [])

    const [shot, setShot] = useState(false)

    const handleClick = () => {
      setShot((p) => !p)
    }

    const spin = async (duration = 200): Promise<void> => {
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
    }

    useImperativeHandle(gunHandleRef, () => {
      return {
        spin,
        shot: handleClick,
      }
    })

    return (
      <div
        ref={mergeRefs(ref, gunRef)}
        className={cn('relative aspect-[1/1.95]', className)}
        // onClick={handleClick}
        {...props}
      >
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
        {shot && (
          <>
            <div className='relative top-[7%] left-1/2 z-5 aspect-square w-[53%] -translate-x-1/2'>
              <div
                className={cn(
                  'absolute inset-0 scale-200 opacity-0',
                  'zoom-in-50 fade-in fill-mode-backwards animate-[shot] duration-200 ease-linear',
                )}
              >
                <img src={images.shot1} alt='' />
              </div>
              <div
                className={cn(
                  'absolute inset-0 scale-600 opacity-0',
                  'zoom-in fade-in fill-mode-backwards animate-[shot] delay-150 duration-200 ease-linear',
                )}
              >
                <img src={images.shot2} alt='' />
              </div>
            </div>
            <div
              className={cn(
                'fixed inset-0 z-50 opacity-0',
                'fill-mode-both fade-in animate-[shot] delay-300 duration-200 ease-linear',
              )}
            >
              <img src={images.shot3} alt='' />
            </div>
          </>
        )}
      </div>
    )
  },
)

export { GunCharacter }
