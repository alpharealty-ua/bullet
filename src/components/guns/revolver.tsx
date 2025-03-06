import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import mergeRefs from 'merge-refs'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Click } from './click'
import { useClick } from './use-click'

const START_ROTATE = 15
const MIN_ADD_SPEED = 10
const MAX_ADD_SPEED = 100
const MAX_SPEED = 100

export type RevolverHandle = {
  spin: (duration?: number) => Promise<void>
  click: () => void
}

const Revolver = React.forwardRef<
  HTMLDivElement,
  React.HtmlHTMLAttributes<HTMLDivElement> & {
    beforeSlot: React.ReactNode
    disabled: boolean
    gunHandleRef: React.ForwardedRef<RevolverHandle>
  }
>(({ beforeSlot, disabled, className, gunHandleRef, ...props }, ref) => {
  const gunRef = useRef<HTMLDivElement>(null)
  const rotateRef = useRef(0)
  const speedRotateRef = useRef(0)
  const speedRef = useRef(0)

  useEffect(() => {
    if (disabled) {
      return
    }

    const gunDom = gunRef.current

    if (gunDom === null) {
      return
    }

    const chamberRotateDom = gunDom.querySelector(
      '[data-chamber-rotate]',
    ) as HTMLDivElement

    const chamberSpeedDom = gunDom.querySelector(
      '[data-chamber-speed]',
    ) as HTMLDivElement

    if (!(chamberRotateDom && chamberSpeedDom)) {
      return
    }

    chamberRotateDom.ondragstart = () => false

    let clickStartTime = 0

    const pointerDown = (event: PointerEvent) => {
      clickStartTime = Date.now()

      const startX = event.clientX
      const startY = event.clientY

      const { left, width, top, height } =
        chamberRotateDom.getBoundingClientRect()

      chamberRotateDom.setPointerCapture(event.pointerId)

      const startRotate = rotateRef.current
      let prevX = startX
      let prevY = startY

      chamberRotateDom.style.transitionDuration = `0s`

      const pointerMove = (event: PointerEvent) => {
        const currentX = event.clientX
        const currentY = event.clientY

        const deltaX = currentX - prevX
        const deltaY = currentY - prevY

        prevX = currentX
        prevY = currentY

        const halfHeight = height / 2
        const halfWidth = width / 2

        const y = currentY - top
        const x = currentX - left

        const passedCenterOnY = y > halfHeight
        const passedCenterOnX = x > halfWidth

        const directionX = passedCenterOnY ? -1 : 1
        const directionY = passedCenterOnX ? 1 : -1

        const deltaRotate = deltaY * directionY + deltaX * directionX

        rotateRef.current += deltaRotate
        chamberRotateDom.style.rotate = `${rotateRef.current}deg`
      }

      const poinerUp = (event: PointerEvent) => {
        const isClick = startX === event.clientX && startY === event.clientY
        const clickDuration = Date.now() - clickStartTime
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
          chamberSpeedDom.dispatchEvent(new CustomEvent('speedchanged'))
        }

        rotateRef.current = 60 * Math.round(rotateRef.current / 60)
        chamberRotateDom.style.transitionDuration = ``
        chamberRotateDom.style.rotate = `${rotateRef.current}deg`

        chamberRotateDom.removeEventListener('pointermove', pointerMove)
        chamberRotateDom.removeEventListener('pointerup', poinerUp)
      }

      chamberRotateDom.addEventListener('pointermove', pointerMove)
      chamberRotateDom.addEventListener('pointerup', poinerUp)
    }

    chamberRotateDom.addEventListener('pointerdown', pointerDown)

    return () => {
      chamberRotateDom.removeEventListener('pointerdown', pointerDown)
    }
  }, [disabled])

  useEffect(() => {
    if (disabled) {
      return
    }

    const gunDom = gunRef.current

    if (gunDom === null) {
      return
    }

    const chamberRotateDom = gunDom.querySelector(
      '[data-chamber-rotate]',
    ) as HTMLDivElement

    const chamberSpeedDom = chamberRotateDom.querySelector(
      '[data-chamber-speed]',
    ) as HTMLDivElement

    if (!(chamberRotateDom && chamberSpeedDom)) {
      return
    }

    const stopSpin = () => {
      const roundedRotate = 60 * Math.round(speedRotateRef.current / 60)
      chamberSpeedDom.style.rotate = `${roundedRotate}deg`
    }

    const startSpin = () => {
      const speed = speedRef.current
      const sign = speed >= 0 ? 1 : -1

      if (speed * sign < 5 * sign) {
        stopSpin()
        return
      }

      speedRef.current -= 5 * sign
      chamberSpeedDom.style.rotate = `${(speedRotateRef.current += speed)}deg`
    }

    chamberSpeedDom.addEventListener('transitionend', startSpin)
    chamberSpeedDom.addEventListener('speedchanged', startSpin)

    return () => {
      stopSpin()
      chamberSpeedDom.removeEventListener('transitionend', startSpin)
      chamberSpeedDom.removeEventListener('speedchanged', startSpin)
    }
  }, [disabled])

  const spin = useCallback(async (duration = 200): Promise<void> => {
    const gunDom = gunRef.current

    if (gunDom === null) {
      return
    }

    const chamberRotateDom = gunDom.querySelector(
      '[data-chamber-rotate]',
    ) as HTMLDivElement

    if (chamberRotateDom === null) {
      return
    }

    return new Promise<void>((resolve) => {
      const transitionend = (event: TransitionEvent) => {
        if (event.propertyName !== 'rotate') {
          return
        }

        chamberRotateDom.style.transitionDuration = ``
        chamberRotateDom.removeEventListener('transitionend', transitionend)
        resolve()
      }

      chamberRotateDom.style.rotate = (rotateRef.current += 60) + 'deg'
      chamberRotateDom.style.transitionDuration = `${duration}ms`
      chamberRotateDom.addEventListener('transitionend', transitionend)
    })
  }, [])

  const click = useClick(gunRef)

  useImperativeHandle(gunHandleRef, () => ({
    spin,
    click,
  }))

  return (
    <div
      ref={mergeRefs(gunRef, ref)}
      className={cn('relative mx-auto aspect-[1/1.881] w-50', className)}
      {...props}
    >
      <Click
        leftClick={{
          className: 'top-[10%] right-[70%] w-[50%]',
        }}
        rightClick={{
          className: 'top-[10%] left-[65%] w-[50%]',
        }}
      />
      <div className='absolute inset-0 overflow-hidden'>
        <div
          className={cn(
            'absolute top-[18%] right-0 left-0 aspect-square cursor-grab bg-contain bg-center bg-no-repeat transition-transform duration-1000 ease-linear',
            disabled && 'cursor-auto',
          )}
          style={{ rotate: `${START_ROTATE}deg` }}
          data-chamber
        >
          <div
            className='absolute inset-0 touch-none bg-contain bg-center bg-no-repeat duration-200 ease-linear'
            style={{ rotate: `${rotateRef.current}deg` }}
            data-chamber-rotate
          >
            <div
              className='absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-100 ease-linear'
              style={{ backgroundImage: `url(${images.gunchamber})` }}
              data-chamber-speed
            ></div>
          </div>
        </div>
        <div
          className='pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat'
          style={{
            backgroundImage: `url(${images.gunbody})`,
          }}
        ></div>
      </div>
    </div>
  )
})

export { Revolver }
