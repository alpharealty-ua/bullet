import React, { useRef, useState } from 'react'
import mergeRefs from 'merge-refs'

import { useSettingsStore } from '@/store/settings.store'
import { wait } from '@/lib/utils'
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
  const [startedAnimation, setStartedAnimtion] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const allProps = {
    ...props,
    disabled:
      props.as === 'button'
        ? props.disabled || disabled || startedAnimation
        : undefined,
  }

  const mouseClick = async (): Promise<void> => {
    const buttonDom = buttonRef.current

    if (buttonDom === null) {
      return
    }

    setStartedAnimtion(true)

    await playAudio('mouseclick')

    buttonDom.classList.add('animate-button-click')

    await new Promise<Event>((resolve) => {
      buttonDom.addEventListener('animationend', resolve, { once: true })
    })

    buttonDom.classList.remove('animate-button-click')

    setStartedAnimtion(false)

    await wait(0) // need for set disabled state
  }

  const handeMouseDown = async () => {
    const buttonDom = buttonRef.current

    if (buttonDom === null) {
      return
    }

    skipWaitAnimation ? mouseClick() : await mouseClick()

    buttonDom.click()
  }

  const handleClick = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> &
      React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (event.isTrusted) {
      event.preventDefault()
      return
    }

    setDisabled(true)

    onClick && (await onClick(event))

    setDisabled(false)
  }

  return (
    <Button
      ref={mergeRefs(buttonRef, ref)}
      onMouseDown={handeMouseDown}
      onClick={handleClick}
      {...allProps}
    />
  )
})

export { ButtonWithAudio }
