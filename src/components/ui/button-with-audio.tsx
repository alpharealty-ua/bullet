import React, { useRef, useState } from 'react'
import mergeRefs from 'merge-refs'

import { useSettings } from '@/store/settings.store'
import { Button, ButtonProps } from './button'

export const ButtonWithAudio = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, disabled, ...props }, ref) => {
    const playAudio = useSettings(({ playAudio }) => playAudio)
    const [startedAnimation, setStartedAnimation] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const mouseClick = async (): Promise<void> => {
      const buttonDom = buttonRef.current

      if (buttonDom === null) {
        return
      }

      setStartedAnimation(true)
      buttonDom.classList.add('animate-button-click')

      const audio = await playAudio('mouseclick')

      await new Promise<Event>((resolve) => {
        audio.addEventListener('ended', resolve, { once: true })
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
