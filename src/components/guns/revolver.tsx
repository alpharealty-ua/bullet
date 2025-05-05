import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import mergeRefs from 'merge-refs'

import { useSettingsStore } from '@/store/settings.store'
import { IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Click } from '@/components/guns/click'
import { useClick } from '@/components/guns/use-click'
import { useSpin } from '@/components/guns/use-spin'
import { useShot } from '@/components/guns/use-shot'

const START_ROTATE = 15
const MIN_ADD_SPEED = 10
const MAX_ADD_SPEED = 100
const MAX_SPEED = 100

export interface RevolverHandle {
  spin: (duration?: number) => Promise<void>
  trigger: () => Promise<void>
  click: () => Promise<void>
  shot: () => Promise<void>
}

const Revolver = React.forwardRef<
  HTMLDivElement,
  React.HtmlHTMLAttributes<HTMLDivElement> & {
    disabled: boolean
    gunHandleRef: React.ForwardedRef<RevolverHandle>
  }
>(({ disabled, className, gunHandleRef, ...props }, ref) => {
  const playSound = useSettingsStore(({ playSound }) => playSound)
  const gunRef = useRef<HTMLDivElement>(null)
  const rotateRef = useRef(0)
  const speedRotateRef = useRef(0)
  const speedRef = useRef(0)
  const [showShot, setShowShot] = useState(false)

  useEffect(() => {
    if (disabled) {
      return
    }

    const chamberRotateEl = gunRef.current?.querySelector(
      '[data-chamber-rotate]',
    ) as HTMLDivElement
    const chamberSpeedEl = gunRef.current?.querySelector(
      '[data-chamber-speed]',
    ) as HTMLDivElement

    if (!(chamberRotateEl && chamberSpeedEl)) {
      return
    }

    chamberRotateEl.ondragstart = () => false

    let clickStartTime = 0

    const pointerDown = (event: PointerEvent) => {
      clickStartTime = Date.now()

      const startX = event.clientX
      const startY = event.clientY

      const { left, width, top, height } =
        chamberRotateEl.getBoundingClientRect()

      chamberRotateEl.setPointerCapture(event.pointerId)

      const startRotate = rotateRef.current
      let prevX = startX
      let prevY = startY

      chamberRotateEl.style.transitionDuration = `0s`

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
        chamberRotateEl.style.rotate = `${rotateRef.current}deg`
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
          chamberSpeedEl.dispatchEvent(new CustomEvent('speedchanged'))
        }

        rotateRef.current = 60 * Math.round(rotateRef.current / 60)
        chamberRotateEl.style.transitionDuration = ``
        chamberRotateEl.style.rotate = `${rotateRef.current}deg`

        chamberRotateEl.removeEventListener('pointermove', pointerMove)
        chamberRotateEl.removeEventListener('pointerup', poinerUp)
      }

      chamberRotateEl.addEventListener('pointermove', pointerMove)
      chamberRotateEl.addEventListener('pointerup', poinerUp)
    }

    chamberRotateEl.addEventListener('pointerdown', pointerDown)

    return () => {
      chamberRotateEl.removeEventListener('pointerdown', pointerDown)
    }
  }, [disabled])

  useEffect(() => {
    if (disabled) {
      return
    }

    const chamberRotateEl = gunRef.current?.querySelector(
      '[data-chamber-rotate]',
    ) as HTMLDivElement
    const chamberSpeeEl = gunRef.current?.querySelector(
      '[data-chamber-speed]',
    ) as HTMLDivElement

    if (!(chamberRotateEl && chamberSpeeEl)) {
      return
    }

    const stopSpin = () => {
      const roundedRotate = 60 * Math.round(speedRotateRef.current / 60)
      chamberSpeeEl.style.rotate = `${roundedRotate}deg`
    }

    let started = false

    const speedChanged = () => {
      if (started) {
        return
      }

      startSpin()
    }

    const startSpin = () => {
      started = true
      const speed = speedRef.current
      const sign = speed >= 0 ? 1 : -1

      if (speed * sign < 5 * sign) {
        started = false
        stopSpin()
        return
      }

      speedRef.current -= 5 * sign
      chamberSpeeEl.style.rotate = `${(speedRotateRef.current += speed)}deg`
    }

    chamberSpeeEl.addEventListener('transitionend', startSpin)
    chamberSpeeEl.addEventListener('speedchanged', speedChanged)

    return () => {
      stopSpin()
      chamberSpeeEl.removeEventListener('transitionend', startSpin)
      chamberSpeeEl.removeEventListener('speedchanged', speedChanged)
    }
  }, [disabled])

  const shot = useShot(playSound, setShowShot)

  const spin = useSpin(gunRef, rotateRef)

  const trigger = async () => void (await playSound('triggerpull'))

  const click = useClick(gunRef)

  useImperativeHandle(gunHandleRef, () => ({
    shot,
    spin,
    trigger,
    click,
  }))

  return (
    <div
      ref={mergeRefs(gunRef, ref)}
      className={cn('relative mx-auto aspect-[1/1.881]', className)}
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
              style={{ backgroundImage: `url(${IMAGES.gunchamber})` }}
              data-chamber-speed
            ></div>
          </div>
        </div>
        <div
          className='pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat'
          style={{
            backgroundImage: `url(${IMAGES.gunbody})`,
          }}
          data-body
        ></div>
      </div>
      {showShot && (
        <div className='relative -left-0.5 h-[48%]'>
          <div
            className={cn(
              'absolute inset-[25%] mx-auto bg-contain bg-center bg-no-repeat',
              'fill-mode-both animate-[revolver-shot] delay-0 duration-100',
            )}
            style={{ backgroundImage: `url(${IMAGES.shotrevolver1})` }}
          ></div>
          <div
            className={cn(
              'absolute inset-0 mx-auto bg-contain bg-center bg-no-repeat',
              'fill-mode-both animate-[revolver-shot] delay-100 duration-100',
            )}
            style={{ backgroundImage: `url(${IMAGES.shotrevolver2})` }}
          ></div>
          <div
            className={cn(
              'absolute inset-0 mx-auto scale-125 bg-contain bg-center bg-no-repeat',
              'fill-mode-both animate-[revolver-shot] delay-200 duration-100',
            )}
            style={{ backgroundImage: `url(${IMAGES.shotrevolver3})` }}
          ></div>
          <div
            className={cn(
              'absolute inset-0 mx-auto scale-400 bg-[length:35%] bg-center bg-no-repeat',
              'fill-mode-both animate-[revolver-shot] delay-300 duration-100',
            )}
            style={{ backgroundImage: `url(${IMAGES.shotrevolver1})` }}
          ></div>
          <div
            className={cn(
              'absolute inset-0 mx-auto scale-600 bg-[length:35%] bg-center bg-no-repeat',
              'fill-mode-both animate-[revolver-shot] delay-400 duration-100',
            )}
            style={{ backgroundImage: `url(${IMAGES.shotrevolver1})` }}
          ></div>
          <div
            className={cn(
              'absolute inset-0 mx-auto scale-800 bg-[length:35%] bg-center bg-no-repeat',
              'fill-mode-both animate-[revolver-shot] delay-500 duration-100',
            )}
            style={{ backgroundImage: `url(${IMAGES.shotrevolver1})` }}
          ></div>
        </div>
      )}
    </div>
  )
})

export { Revolver }
