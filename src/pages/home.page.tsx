import { useRef } from 'react'

import { useProfile } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { useAuthStore } from '@/store/auth.store'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from '@/components/logo'
import { Rules } from '@/components/rules'
import { LeadboardIcon } from '@/components/leadboard-icon'
import { ProfileLink } from '@/components/profile-link'

const HomePage = () => {
  const modal = useCustomModal()
  const token = useAuthStore(({ token }) => token)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { data: user, isPending } = useProfile()

  const handleGameRules = async () => {
    modal.show({
      contentSlot: <Rules />,
    })
  }

  return (
    <div
      className='relative flex grow-1 flex-col items-center justify-center gap-10 px-3 py-12'
      ref={wrapperRef}
    >
      {
        <header className='absolute top-0 right-0 flex h-18 items-center justify-between gap-4 px-3 py-2'>
          {token && isPending ? (
            'loading'
          ) : user ? (
            <ProfileLink name={user.username} />
          ) : (
            <>
              <ButtonWithAudio
                as='link'
                className='w-24 text-xs'
                image='button'
                to={ROUTES.auth.login}
                text='Login'
              />
              <ButtonWithAudio
                as='link'
                className='w-24 text-xs'
                image='button'
                to={ROUTES.auth.register}
                text='Register'
              />
            </>
          )}
        </header>
      }
      <Logo as='button' size='xl' />
      <div className='flex flex-col items-center justify-center gap-6'>
        <ButtonWithAudio
          as='link'
          to={ROUTES.duel.root}
          image='duel'
          className='w-30'
        />
        <ButtonWithAudio
          as='link'
          to={ROUTES.solo.root}
          image='solo'
          className='w-30'
        />
        <ButtonWithAudio
          as='button'
          image='gamerules'
          className='w-24'
          onClick={handleGameRules}
        />
      </div>
      <LeadboardIcon />
    </div>
  )
}

export { HomePage }
