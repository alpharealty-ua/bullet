import React from 'react'
import { To } from 'react-router'

import { ROUTES } from '@/routes/path'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { cn } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Leaderboard } from '@/components/leaderboard/leaderboard'
import { ButtonProps, OmitUnion } from '@/components/ui/button'

type OmitTo<T> = T extends { to: To } ? Omit<T, 'to'> : T

type LeaderboardButtonProps = OmitUnion<ButtonProps, 'onClick' | 'bg' | 'image'>

const LeaderboardButton = ({
  className,
  ...props
}: OmitTo<LeaderboardButtonProps>) => {
  const modal = useCustomModal()

  const openPopup = () => {
    modal.show({ contentSlot: <Leaderboard /> })
  }

  const handleLeaderboardClick = async (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    event.preventDefault()

    const targetEl = event.currentTarget

    if (!(targetEl instanceof HTMLElement)) {
      return
    }

    targetEl.classList.add('is-animate')
    await new Promise((resolve) =>
      targetEl.addEventListener('transitionend', resolve, { once: true }),
    )
    targetEl.classList.remove('is-animate')

    props.as === 'button'
      ? openPopup()
      : targetEl.dispatchEvent(
          new PointerEvent('click', { bubbles: true, cancelable: true }),
        )
  }

  const allProps: LeaderboardButtonProps =
    props.as === 'link'
      ? {
          ...props,
          to: ROUTES.leaderboard.root,
        }
      : { ...props }

  return (
    <ButtonWithAudio
      image='leaderboardstar'
      onClick={handleLeaderboardClick}
      className={cn(
        'w-10',
        'repeat-1 ease-linear [&.is-animate]:rotate-360 [&.is-animate]:opacity-0 [&.is-animate]:delay-0 [&.is-animate]:duration-500',
        className,
      )}
      {...allProps}
    />
  )
}

export { LeaderboardButton }
