import React, { useEffect, useImperativeHandle, useRef } from 'react'
import mergeRefs from 'merge-refs'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

export interface GunCharacterProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  gunHandleRef?: React.ForwardedRef<{
    spin: (duration?: number) => Promise<void>
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

    const handleClick = () => {
      spin(200)
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
      }
    })

    return (
      <div
        ref={mergeRefs(ref, gunRef)}
        className={cn('relative aspect-[1/1.95]', className)}
        onClick={handleClick}
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
      </div>
    )
  },
)

export { GunCharacter }
