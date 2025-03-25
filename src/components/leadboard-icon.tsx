import React, { useRef } from 'react'

import { ROUTES } from '@/routes/path'
import { cn } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const LeadboardIcon = () => {
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const isTrustedRef = useRef(true)

  const handleLeadboardClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!isTrustedRef.current) {
      return
    }

    event.preventDefault()

    const targetEl = event.currentTarget

    if (!(targetEl instanceof HTMLAnchorElement)) {
      return
    }

    targetEl.classList.add('is-animate')
    await new Promise((resolve) =>
      targetEl.addEventListener('transitionend', resolve, { once: true }),
    )
    targetEl.classList.remove('is-animate')

    isTrustedRef.current = false
    targetEl.click()
    isTrustedRef.current = true
  }

  return (
    <ButtonWithAudio
      ref={buttonRef}
      as='link'
      to={ROUTES.leaderboard.root}
      image='leaderboardstar'
      className={cn(
        'absolute right-4 bottom-4 w-20',
        'repeat-1 ease-linear [&.is-animate]:rotate-360 [&.is-animate]:opacity-0 [&.is-animate]:delay-0 [&.is-animate]:duration-500',
      )}
      onClick={handleLeadboardClick}
    />
  )
}

export { LeadboardIcon }
