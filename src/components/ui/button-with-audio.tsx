import React, { useRef, useState } from 'react'
import mergeRefs from 'merge-refs'

import { useSettingsStore } from '@/store/settings.store'
import { wait } from '@/lib/utils'
import { Button, ButtonProps } from '@/components/ui/button'

export const ButtonWithAudio = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, ...props }, ref) => {
    const playAudio = useSettingsStore(({ playAudio }) => playAudio)
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

      setDisabled(true)

      await playAudio('mouseclick')

      buttonDom.classList.add('animate-button-click')

      await new Promise<Event>((resolve) => {
        buttonDom.addEventListener('animationend', resolve, { once: true })
      })

      buttonDom.classList.remove('animate-button-click')
      setDisabled(false)

      await wait(0) // need for set disabled state
    }

    const handeMouseDown = async () => {
      const buttonDom = buttonRef.current

      if (buttonDom === null) {
        return
      }

      await mouseClick()

      buttonDom.click()
    }

    const handleClick = (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent> &
        React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      if (event.isTrusted) {
        event.preventDefault()
        return
      }

      onClick && onClick(event)
    }

    return (
      <Button
        ref={mergeRefs(buttonRef, ref)}
        onMouseDown={handeMouseDown}
        onClick={handleClick}
        {...allProps}
      />
    )
  },
)
