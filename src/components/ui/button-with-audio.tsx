import React, { useRef, useState } from 'react'
import mergeRefs from 'merge-refs'

import { useSettingsStore } from '@/store/settings.store'
import { wait } from '@/lib/utils'
import { Button, ButtonProps, OmitUnion } from '@/components/ui/button'

type ButtonWithAudioProps = OmitUnion<ButtonProps, 'onClick'> & {
  skipWaitAnimation?: boolean
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> &
      React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void | Promise<void>
}

const ButtonWithAudio = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonWithAudioProps
>(({ onClick, skipWaitAnimation = false, ...props }, ref) => {
  const playSound = useSettingsStore(({ playSound }) => playSound)
  const isMouseDownFiredRef = useRef(false)
  const [disabled, setDisabled] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const mouseClick = async (buttonEl: HTMLButtonElement): Promise<void> => {
    await playSound('mouseclick')

    const ANIMATION_NAME = 'animate-button-click'

    buttonEl.classList.add(ANIMATION_NAME)

    const iterationCount = getComputedStyle(buttonEl).animationIterationCount
    const isInfititeCount = iterationCount === 'infinite'

    const promise = new Promise<Event>((resolve) => {
      buttonEl.addEventListener('animationend', resolve, { once: true })
    })

    !isInfititeCount && (await promise)

    buttonEl.classList.remove(ANIMATION_NAME)

    if (isInfititeCount) {
      buttonEl.style.animationIterationCount = ''
    }
  }

  const handlePointerDown = async (
    event:
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (event.button !== 0) {
      return
    }

    if ('disabled' in allProps && allProps.disabled) {
      return
    }

    const buttonEl = buttonRef.current

    if (buttonEl === null) {
      return
    }

    if (buttonEl.dataset.disabled === 'true') {
      return
    }

    if (isMouseDownFiredRef.current) {
      return
    }

    isMouseDownFiredRef.current = true

    skipWaitAnimation ? mouseClick(buttonEl) : await mouseClick(buttonEl)

    buttonEl.dispatchEvent(
      new PointerEvent('click', { bubbles: true, cancelable: true }),
    )

    isMouseDownFiredRef.current = false
  }

  const handleClick = async (
    event:
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const isMouseDownFired = isMouseDownFiredRef.current
    const isTrusted = event.isTrusted
    const dispatchedAfterAnimation = !isTrusted && isMouseDownFired
    const dispatchedOutside = !(isTrusted || isMouseDownFired)

    if (dispatchedOutside) {
      return
    }

    if (dispatchedAfterAnimation) {
      const prevFocus = document.activeElement
      const promise = onClick && onClick(event as Parameters<typeof onClick>[0])

      if (
        promise instanceof Promise &&
        prevFocus &&
        prevFocus === buttonRef.current
      ) {
        try {
          setDisabled(true)
          await promise
        } finally {
          setDisabled(false)
        }
        await wait(0).promise
        buttonRef.current?.focus()
      }

      return
    }

    event.preventDefault()

    const notPointerClick =
      'pointerId' in event.nativeEvent && event.nativeEvent.pointerId === -1

    if (notPointerClick) {
      buttonRef.current?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
    }
  }

  const allProps: ButtonWithAudioProps = {
    ...props,
    ...(props.as === 'button'
      ? { disabled: props.disabled || disabled }
      : undefined),
  }

  return (
    <Button
      ref={mergeRefs(buttonRef, ref)}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      {...allProps}
    />
  )
})

export { ButtonWithAudio }
