import React, { useEffect, useRef, useState } from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

const Revolver = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    beforeSlot: React.ReactNode
    disabled: boolean
  }
>(({ className, style, beforeSlot, disabled, ...props }, ref) => {
  const bulletChambeRef = useRef<HTMLDivElement>(null)
  const rotateRef = useRef(0)
  const speedRotateRef = useRef(0)
  const speedRef = useRef(0)
  const [speed, setSpeed] = useState(false)

  useEffect(() => {
    if (disabled) {
      return
    }

    const bulletDom = bulletChambeRef.current

    if (bulletDom === null) {
      return
    }

    let hasMove = false
    let clickStartTime = 0

    const pointerDown = (event: PointerEvent) => {
      hasMove = false
      clickStartTime = Date.now()
      const startX = event.clientX
      let startY = event.clientY
      let startRotate = rotateRef.current

      const { left, width } = bulletDom.getBoundingClientRect()

      bulletDom.setPointerCapture(event.pointerId)
      let directionY = startX > left + width / 2 ? -1 : 1

      const pointerMove = (event: PointerEvent) => {
        hasMove = true
        const endX = event.clientX
        const endY = event.clientY

        // @ts-ignore
        const deltaX = startX - endX
        const deltaY = startY - endY

        const prevDirection = directionY
        directionY = endX > left + width / 2 ? -1 : 1

        if (directionY !== prevDirection) {
          startY = endY
          startRotate = rotateRef.current
          return
        }

        rotateRef.current = startRotate + deltaY * directionY
        bulletDom.style.transitionDuration = `0s`
        bulletDom.style.transform = `rotate(${rotateRef.current}deg)`
      }

      const poinerUp = (_: PointerEvent) => {
        if (!hasMove) {
          const ONE_CHAMBER = 60
          const MAX_CHAMBERS = 4 * ONE_CHAMBER
          const clickDuration = Date.now() - clickStartTime
          const clickRotate = Math.max(
            MAX_CHAMBERS - clickDuration,
            ONE_CHAMBER,
          )
          speedRef.current = 0
          rotateRef.current += clickRotate
        } else {
          speedRef.current += 60
        }
        setSpeed((p) => !p)

        rotateRef.current = 60 * Math.round(rotateRef.current / 60)
        bulletDom.style.transitionDuration = ``
        bulletDom.style.transform = `rotate(${rotateRef.current}deg)`

        bulletDom.removeEventListener('pointermove', pointerMove)
        bulletDom.removeEventListener('pointerup', poinerUp)
      }

      bulletDom.addEventListener('pointermove', pointerMove)
      bulletDom.addEventListener('pointerup', poinerUp)
    }

    bulletDom.addEventListener('pointerdown', pointerDown)

    return () => {
      bulletDom.removeEventListener('pointerdown', pointerDown)
    }
  }, [disabled])

  useEffect(() => {
    if (disabled) {
      return
    }

    const bulletDom = bulletChambeRef.current

    if (bulletDom === null) {
      return
    }

    const dom = bulletDom.children[0] as HTMLDivElement

    if (dom === null) {
      return
    }

    const speedRotate = () => {
      const speed = speedRef.current
      if (speed < 0) {
        if (speedRotateRef.current % 60) {
          dom.style.transform = `rotate(${(speedRotateRef.current += 60 - (speedRotateRef.current % 60))}deg)`
        }
        clearInterval(id)
        return
      }

      speedRef.current -= 5

      dom.style.transform = `rotate(${(speedRotateRef.current += speed)}deg)`
    }
    const id = setInterval(speedRotate, 100)
    speedRotate()
    return () => {
      if (speedRotateRef.current % 60) {
        dom.style.transform = `rotate(${(speedRotateRef.current += 60 - (speedRotateRef.current % 60))}deg)`
      }
      clearInterval(id)
    }
  }, [disabled, speed])

  return (
    <div
      className='animate-in fade-in-0 absolute right-0 bottom-7 left-0 mx-auto aspect-[1/1.881] w-[216px] overflow-hidden duration-100 lg:w-[251px]'
      ref={ref}
    >
      {beforeSlot}
      <div
        className={cn(
          'absolute top-[18%] right-0 left-0 aspect-square cursor-grab bg-contain bg-center bg-no-repeat transition-transform duration-[1500ms]',
          disabled && 'cursor-auto',
          className,
        )}
        style={{ ...style }}
        {...props}
      >
        <div
          ref={bulletChambeRef}
          className='absolute inset-0 touch-none bg-contain bg-center bg-no-repeat duration-200'
          style={{ transform: `rotate(${rotateRef.current}deg)` }}
        >
          <div
            className='absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-200 ease-linear'
            style={{ backgroundImage: `url(${images.bulletChambe})` }}
          ></div>
        </div>
      </div>
      <div
        className='pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat'
        style={{
          backgroundImage: `url(${images.body})`,
        }}
      ></div>
    </div>
  )
})

export { Revolver }
