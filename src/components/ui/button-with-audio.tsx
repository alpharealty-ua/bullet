import React, { useRef, useState } from 'react'
import mergeRefs from 'merge-refs'

import { useSettingsStore } from '@/store/settings.store'
import { Button, ButtonProps } from '@/components/ui/button'

export const ButtonWithAudio = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, disabled, ...props }, ref) => {
    const playAudio = useSettingsStore(({ playAudio }) => playAudio)
    const [startedAnimation, setStartedAnimation] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const mouseClick = async (): Promise<void> => {
      const buttonDom = buttonRef.current

      if (buttonDom === null) {
        return
      }

      setStartedAnimation(true)

      await playAudio('mouseclick')

      buttonDom.classList.add('animate-button-click')

      await new Promise<Event>((resolve) => {
        buttonDom.addEventListener('animationend', resolve, { once: true })
      })

      buttonDom.classList.remove('animate-button-click')
      setStartedAnimation(false)
    }

    const handleClick = async (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      await mouseClick()
      onClick && onClick(event)
    }

    return (
      <Button
        ref={mergeRefs(buttonRef, ref)}
        onMouseDown={handleClick}
        disabled={disabled || startedAnimation}
        {...props}
      />
    )
  },
)
