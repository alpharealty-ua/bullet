import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'

import { images } from '@/lib/constants'

const Revolver = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag'> & {
    beforeSlot: React.ReactNode
    onDrag: (x: number, y: number) => void
  }
>(({ className, style, beforeSlot, onDrag, ...props }, ref) => {
  const bulletChambeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bulletDom = bulletChambeRef.current
    if (bulletDom === null) {
      return
    }

    const mouseDown = (event: PointerEvent) => {
      const startX = event.clientX
      const startY = event.clientY

      bulletDom.setPointerCapture(event.pointerId)

      const pointerMove = () => {}

      const poinerUp = (event: PointerEvent) => {
        const endX = event.clientX
        const endY = event.clientY

        const deltaX = Math.abs(startX - endX)
        const deltaY = Math.abs(startY - endY)

        onDrag(deltaX, deltaY)

        bulletDom.removeEventListener('pointermove', pointerMove)
        bulletDom.removeEventListener('pointerup', poinerUp)
      }

      bulletDom.addEventListener('pointermove', pointerMove)
      bulletDom.addEventListener('pointerup', poinerUp)
    }

    bulletDom.addEventListener('pointerdown', mouseDown)

    return () => {
      bulletDom.removeEventListener('pointerdown', mouseDown)
    }
  }, [onDrag])

  return (
    <div
      className='animate-in fade-in-0 absolute right-0 bottom-8 left-0 mx-auto h-[472px] w-[251px] duration-200'
      ref={ref}
    >
      {beforeSlot}
      <div
        ref={bulletChambeRef}
        className={classNames(
          'absolute top-[85px] right-[-8px] left-[-8px] aspect-square cursor-grab bg-contain bg-center bg-no-repeat transition-transform duration-2000',
          className,
        )}
        style={{ backgroundImage: `url(${images.bulletChambe})`, ...style }}
        {...props}
      ></div>
      <div
        className='pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat'
        style={{ backgroundImage: `url(${images.body})` }}
      ></div>
    </div>
  )
})

export { Revolver }
