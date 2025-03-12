import { useNavigate } from 'react-router'
import { useEffect, useRef } from 'react'

import { useProfile } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { cn } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from '@/components/logo'
import { Rules } from '@/components/rules'
import { LeadboardIcon } from '@/components/leadboard-icon'
import { Profile } from '@/components/profile'

const HomePage = () => {
  const navigate = useNavigate()
  const modal = useCustomModal()
  // TODO: IS FETCING ON FIRST RENDER
  const { data: user } = useProfile()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleSoloButton = async () => {
    navigate(ROUTES.solo.root)
  }

  const handleDuelButton = async () => {
    navigate(ROUTES.duel.root)
  }

  const handleGameRules = async () => {
    modal.show({
      contentSlot: <Rules />,
    })
  }

  const handleLoginClick = () => {
    navigate(ROUTES.auth.login)
  }

  const handleRegisterClick = () => {
    navigate(ROUTES.auth.register)
  }

  const handleLeadboardClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!event.isTrusted) {
      return
    }

    event.preventDefault()

    const target = event.target

    if (!(target instanceof HTMLAnchorElement)) {
      return
    }

    target.classList.add('is-animate')
  }

  useEffect(() => {
    const wrapperDom = wrapperRef.current

    if (wrapperDom === null) {
      return
    }

    const link = wrapperDom.querySelector(
      '[data-leaderboardicon]',
    ) as HTMLAnchorElement

    if (link === null) {
      return
    }

    const transitionEnd = () => {
      link.classList.remove('is-animate')
      link.click()
      link.removeEventListener('transitionend', transitionEnd)
    }

    link.addEventListener('transitionend', transitionEnd)

    return () => {
      link.removeEventListener('transitionend', transitionEnd)
    }
  }, [])

  const handleProfileClick = () => {
    modal.show({ contentSlot: <Profile /> })
  }

  return (
    <div
      className='relative flex grow-1 flex-col items-center justify-center gap-10 px-3 py-12'
      ref={wrapperRef}
    >
      {
        <div className='absolute top-4 right-4 flex gap-4'>
          {user ? (
            <>
              <button
                onClick={handleProfileClick}
                className='cursor-pointer self-end'
              >
                {user.username}
              </button>
            </>
          ) : (
            <>
              <ButtonWithAudio
                className='w-24 text-xs'
                text='Login'
                onClick={handleLoginClick}
              />
              <ButtonWithAudio
                className='w-24 text-xs'
                text='Register'
                onClick={handleRegisterClick}
              />
            </>
          )}
        </div>
      }
      <Logo size='xl' />
      <div className='flex flex-col items-center justify-center gap-6'>
        <ButtonWithAudio
          image='duel'
          className='w-30'
          onClick={handleDuelButton}
        />
        <ButtonWithAudio
          image='solo'
          className='w-30'
          onClick={handleSoloButton}
        />
        <ButtonWithAudio
          image='gamerules'
          className='w-24'
          onClick={handleGameRules}
        />
      </div>
      <LeadboardIcon
        to={ROUTES.leaderboard.root}
        className={cn(
          'absolute right-4 bottom-4',
          'repeat-[1] duration-500 ease-linear [&.is-animate]:scale-500 [&.is-animate]:rotate-360 [&.is-animate]:opacity-0',
        )}
        onClick={handleLeadboardClick}
        data-leaderboardicon
      />
    </div>
  )
}

export { HomePage }
