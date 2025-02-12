import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

const START_ROTATE = 15

const Revolver = React.forwardRef<
  {
    spin: (interval: number) => Promise<void>
  },
  {
    beforeSlot: React.ReactNode
    disabled: boolean
  }
>(({ beforeSlot, disabled }, ref) => {
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

    bulletDom.ondragstart = () => false

    let clickStartTime = 0

    const pointerDown = (event: PointerEvent) => {
      clickStartTime = Date.now()

      const startX = event.clientX
      const startY = event.clientY

      const { left, width, top, height } = bulletDom.getBoundingClientRect()

      bulletDom.setPointerCapture(event.pointerId)

      const startRotate = rotateRef.current
      let prevX = startX
      let prevY = startY

      const pointerMove = (event: PointerEvent) => {
        const currentX = event.clientX
        const currentY = event.clientY

        const deltaX = prevX - currentX
        const deltaY = prevY - currentY

        const directionX = currentY > top + height / 2 ? 1 : -1
        const directionY = currentX > left + width / 2 ? -1 : 1

        prevX = currentX
        prevY = currentY

        const deltaRotate = deltaY * directionY + deltaX * directionX

        rotateRef.current += deltaRotate
        bulletDom.style.transitionDuration = `0s`
        bulletDom.style.transform = `rotate(${rotateRef.current}deg)`
      }

      const poinerUp = (event: PointerEvent) => {
        const isClick = startX === event.clientX && startY === event.clientY
        const clickDuration = Date.now() - clickStartTime
        const MIN_ADD_SPEED = 10
        const MAX_ADD_SPEED = 100
        const MAX_SPEED = 100
        const prevSpeed = speedRef.current

        if (isClick) {
          const speed = Math.max(MAX_ADD_SPEED - clickDuration, MIN_ADD_SPEED)
          speedRef.current += speed
        } else if (clickDuration < 200) {
          const endRotate = rotateRef.current - startRotate
          const sign = endRotate > 0 ? 1 : -1
          const speed =
            sign *
            Math.max(
              Math.min(Math.abs(endRotate), MAX_ADD_SPEED),
              MIN_ADD_SPEED,
            )
          speedRef.current += speed
        }
        const speedBoundary =
          Math.min(Math.abs(speedRef.current), MAX_SPEED) *
          (speedRef.current > 0 ? 1 : -1)
        speedRef.current = speedBoundary

        if (prevSpeed !== speedRef.current) {
          // TODO: ADD CUSTOM EVENT TO UPDATE WITHOUT UPDATE STATE
          setSpeed((p) => !p)
        }

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

    const stopSpin = () => {
      const roundedRotate = 60 * Math.round(speedRotateRef.current / 60)
      dom.style.rotate = `${roundedRotate}deg`
      dom.removeEventListener('transitionend', startSpin)
    }

    const startSpin = () => {
      const speed = speedRef.current
      const sign = speed >= 0 ? 1 : -1

      if (speed * sign < 5 * sign) {
        stopSpin()
        return
      }

      speedRef.current -= 5 * sign
      dom.style.rotate = `${(speedRotateRef.current += speed)}deg`
    }

    dom.addEventListener('transitionend', startSpin)
    startSpin()

    return () => {
      stopSpin()
    }
  }, [disabled, speed])

  const spin = async (interval: number): Promise<void> => {
    const bulletDom = bulletChambeRef.current

    if (bulletDom === null) {
      return
    }

    return new Promise<void>((resolve) => {
      const transitionend = (event: TransitionEvent) => {
        if (event.propertyName !== 'rotate') {
          return
        }

        bulletDom.style.transitionDuration = ``
        bulletDom.removeEventListener('transitionend', transitionend)
        resolve()
      }

      bulletDom.style.rotate = (rotateRef.current += 60) + 'deg'
      bulletDom.style.transitionDuration = `${interval}ms`
      bulletDom.addEventListener('transitionend', transitionend)
    })
  }

  useImperativeHandle(ref, () => {
    return {
      spin,
    }
  })

  return (
    <div className='animate-in fade-in-0 absolute right-0 bottom-7 left-0 mx-auto aspect-[1/1.881] w-[216px] duration-100 lg:w-[251px]'>
      {beforeSlot}
      <div className='absolute inset-0 overflow-hidden'>
        <div
          className={cn(
            'absolute top-[18%] right-0 left-0 aspect-square cursor-grab bg-contain bg-center bg-no-repeat transition-transform duration-1000 ease-linear',
            disabled && 'cursor-auto',
          )}
          style={{ rotate: `${START_ROTATE}deg` }}
          data-chambe
        >
          <div
            ref={bulletChambeRef}
            className='absolute inset-0 touch-none bg-contain bg-center bg-no-repeat duration-200 ease-linear'
            style={{ rotate: `${rotateRef.current}deg` }}
          >
            <div
              className='absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-100 ease-linear'
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
    </div>
  )
})

export { Revolver }
