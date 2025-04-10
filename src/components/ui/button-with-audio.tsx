import React, { useRef, useState } from 'react'
import mergeRefs from 'merge-refs'

import { useSettingsStore } from '@/store/settings.store'
import { Button, ButtonProps } from '@/components/ui/button'

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
  const startedAnimationRef = useRef(false)
  const isMouseDownFiredRef = useRef(false)
  const [disabled, setDisabled] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const allProps = {
    ...props,
    disabled: props.as === 'button' ? props.disabled || disabled : undefined,
  }

  const mouseClick = async (): Promise<void> => {
    const buttonDom = buttonRef.current

    if (buttonDom === null) {
      return
    }

    if (startedAnimationRef.current) {
      return
    }

    startedAnimationRef.current = true

    await playAudio('mouseclick')

    buttonDom.classList.add('animate-button-click')
    buttonDom.style.animationIterationCount = '1'

    await new Promise<Event>((resolve) => {
      buttonDom.addEventListener('animationend', resolve, { once: true })
    })

    buttonDom.classList.remove('animate-button-click')
    buttonDom.style.animationIterationCount = ''

    startedAnimationRef.current = false
  }

  const handlePointerDown = async () => {
    const buttonDom = buttonRef.current

    if (buttonDom === null) {
      return
    }

    isMouseDownFiredRef.current = true
    skipWaitAnimation ? mouseClick() : await mouseClick()

    buttonDom.dispatchEvent(
      new PointerEvent('click', { bubbles: true, cancelable: true }),
    )
  }

  const handleClick = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> &
      React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (!isMouseDownFiredRef.current) {
      event.preventDefault()

      const buttonEl = buttonRef.current

      if (buttonEl === null) {
        return
      }

      buttonEl.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
      return
    }

    if (event.isTrusted) {
      event.preventDefault()
      return
    }

    setDisabled(true)

    onClick && (await onClick(event))

    setDisabled(false)

    isMouseDownFiredRef.current = false
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
