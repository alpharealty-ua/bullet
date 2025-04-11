import React, { useRef, useState } from 'react'
import mergeRefs from 'merge-refs'

import { useSettingsStore } from '@/store/settings.store'
import { Button, ButtonProps } from '@/components/ui/button'
import { wait } from '@/lib/utils'

type OmitClick<T> = T extends { as: string } ? Omit<T, 'onClick'> : T

type ButtonWithAudioProps = OmitClick<ButtonProps> & {
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
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const isMouseDownFiredRef = useRef(false)
  const [disabled, setDisabled] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const allProps = {
    ...props,
    disabled: props.as === 'button' ? props.disabled || disabled : undefined,
  }

  const mouseClick = async (buttonEl: HTMLButtonElement): Promise<void> => {
    await playAudio('mouseclick')

    buttonEl.classList.add('animate-button-click')
    buttonEl.style.animationIterationCount = '1'

    await new Promise<Event>((resolve) => {
      buttonEl.addEventListener('animationend', resolve, { once: true })
    })

    buttonEl.classList.remove('animate-button-click')
    buttonEl.style.animationIterationCount = ''
  }

  const handlePointerDown = async () => {
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
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> &
      React.MouseEvent<HTMLButtonElement, MouseEvent>,
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
      const promise = onClick && onClick(event)

      if (
        promise instanceof Promise &&
        prevFocus &&
        prevFocus === buttonRef.current
      ) {
        setDisabled(true)
        await promise
        setDisabled(false)
        await wait(0).promise
        buttonRef.current.focus()
      }

      return
    }

    event.preventDefault()

    const buttonEl = buttonRef.current

    if (buttonEl === null) {
      return
    }

    buttonEl.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
    )
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
