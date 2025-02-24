import React, { useRef, useState } from 'react'
import { Button, ButtonProps } from './button'
import { useAppContext } from '@/context/use-app-context'

export const ButtonWithAudio = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, ...props }, ref) => {
    const { playAudio } = useAppContext()
    const [disabled, setDisabled] = useState(false)
    const disabledRef = useRef(disabled)

    const mouseClick = async (
      callback?: () => void | Promise<void>,
    ): Promise<void> => {
      const disabled = disabledRef.current

      if (disabled) {
        return
      }

      disabledRef.current = true

      const BTN_TRANSITION_DURATION = 200
      setTimeout(() => {
        if (disabledRef.current) {
          setDisabled(true)
        }
      }, BTN_TRANSITION_DURATION)

      const audio = await playAudio('mouseclick')

      const promise = new Promise<void>((resolve) => {
        audio.addEventListener(
          'ended',
          async () => {
            if (callback) {
              await callback()
            }
            resolve()
          },
          { once: true },
        )
      })

      return promise.then((result) => {
        setDisabled(false)
        disabledRef.current = false
        return result
      })
    }

    const handleClick = async (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      await mouseClick(() => onClick && onClick(event))
    }

    return <Button onClick={handleClick} {...props} ref={ref} />
  },
)
