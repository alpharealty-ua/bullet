import React, { useRef, useState } from 'react'
import mergeRefs from 'merge-refs'

import { useAppContext } from '@/context/use-app-context'
import { Button, ButtonProps } from './button'

export const ButtonWithAudio = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, ...props }, ref) => {
    const { playAudio } = useAppContext()
    const [disabled, setDisabled] = useState(false)
    const disabledRef = useRef(disabled)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const mouseClick = async (): Promise<void> => {
      const disabled = disabledRef.current
      const buttonDom = buttonRef.current

      if (buttonDom === null) {
        return
      }

      buttonDom.classList.add('animate-button-click')

      buttonDom.addEventListener(
        'transitionend',
        () => {
          buttonDom.classList.remove('animate-button-click')
        },
        { once: true },
      )

      const audio = await playAudio('mouseclick')

      await new Promise<void>((resolve) => {
        audio.addEventListener(
          'ended',
          () => {
            resolve()
          },
          { once: true },
        )
      })
      setDisabled(false)
      disabledRef.current = false
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
        onClick={handleClick}
        disabled={disabled}
        {...props}
      />
    )
  },
)
