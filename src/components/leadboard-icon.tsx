import React, { useEffect, useRef } from 'react'

import { ROUTES } from '@/routes/path'
import { cn } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const LeadboardIcon = () => {
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const isTrustedRef = useRef(true)

  const handleLeadboardClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isTrustedRef.current) {
      return
    }

    event.preventDefault()

    const target = event.currentTarget

    if (!(target instanceof HTMLAnchorElement)) {
      return
    }

    target.classList.add('is-animate')
  }

  useEffect(() => {
    const buttomDom = buttonRef.current

    if (buttomDom === null) {
      return
    }

    const transitionEnd = () => {
      buttomDom.classList.remove('is-animate')
      isTrustedRef.current = false
      buttomDom.click()
      isTrustedRef.current = true
      buttomDom.removeEventListener('transitionend', transitionEnd)
    }

    buttomDom.addEventListener('transitionend', transitionEnd)

    return () => {
      buttomDom.removeEventListener('transitionend', transitionEnd)
    }
  }, [])

  return (
    <ButtonWithAudio
      ref={buttonRef}
      as='link'
      to={ROUTES.leaderboard.root}
      image='leaderboardstar'
      className={cn(
        'absolute right-4 bottom-4 w-20',
        'repeat-[1] delay-100 duration-500 ease-linear [&.is-animate]:scale-500 [&.is-animate]:rotate-360 [&.is-animate]:opacity-0 [&.is-animate]:delay-0',
      )}
      onClick={handleLeadboardClick}
    />
  )
}

export { LeadboardIcon }
