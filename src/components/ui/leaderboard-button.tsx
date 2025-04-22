import React from 'react'
import { To } from 'react-router'

import { cn } from '@/lib/utils'
import { ButtonProps, OmitUnion } from './button'
import { ButtonWithAudio } from './button-with-audio'
import { ROUTES } from '@/routes/path'
import { Leaderboard } from '../leaderboard/leaderboard'
import { useCustomModal } from '@/hooks/use-custom-modal'

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

  // TODO: FIX TS ERROR
  // @ts-ignore
  const allProps: LeaderboardButtonProps = {
    ...props,
    ...(props.as === 'button' ? undefined : { to: ROUTES.leaderboard.root }),
  }

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
