import { Link, useNavigate } from 'react-router'

import { useProfile } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { images } from '@/lib/constants'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from '@/components/logo'
import { Rules } from '@/components/rules'

const HomePage = () => {
  const nagigate = useNavigate()
  const modal = useCustomModal()
  const { data: user } = useProfile()

  const handleSoloButton = async () => {
    nagigate(ROUTES.solo.index)
  }

  const handleDuelButton = async () => {
    nagigate(ROUTES.duel.index)
  }

  const handleGameRules = async () => {
    modal.show({
      contentSlot: <Rules />,
    })
  }

  const handleLoginClick = () => {
    nagigate(ROUTES.auth.login)
  }

  const handleRegisterClick = () => {
    nagigate(ROUTES.auth.register)
  }

  return (
    <div className='relative flex grow-1 flex-col items-center justify-center gap-10 px-3 py-12'>
      <Logo to='/' size='xl' />
      {user ? (
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
      ) : (
        <div className='flex flex-col gap-4'>
          <ButtonWithAudio text='Login' onClick={handleLoginClick} />
          <ButtonWithAudio text='Register' onClick={handleRegisterClick} />
        </div>
      )}
      <Link
        to={ROUTES.leaderboard.index}
        className='absolute right-4 bottom-4 aspect-[176/186] h-20 w-20 bg-contain bg-center bg-no-repeat'
        style={{
          backgroundImage: `url(${images.leaderboardstar})`,
        }}
      ></Link>
    </div>
  )
}

export { HomePage }
