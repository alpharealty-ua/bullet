import React, { useEffect, useRef } from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

const Revolver = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag'> & {
    beforeSlot: React.ReactNode
    onDrag: (x: number, y: number) => void
    disabled: boolean
  }
>(({ className, style, beforeSlot, onDrag, disabled, ...props }, ref) => {
  const bulletChambeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bulletDom = bulletChambeRef.current

    if (disabled || bulletDom === null) {
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
  }, [onDrag, disabled])

  return (
    <div
      className='animate-in fade-in-0 absolute right-0 bottom-8 left-0 mx-auto aspect-[1/1.881] w-[200px] duration-200 lg:w-[251px]'
      ref={ref}
    >
      {beforeSlot}
      <div
        ref={bulletChambeRef}
        className={cn(
          'absolute top-[18%] right-[-8px] left-[-8px] aspect-square cursor-grab touch-none bg-contain bg-center bg-no-repeat transition-transform duration-[1500ms]',
          disabled && 'cursor-auto',
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
