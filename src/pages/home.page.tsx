import { useNavigate } from 'react-router'

import { useProfile } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from '../components/logo'
import { Rules } from '../components/rules'

const Home = () => {
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
    </div>
  )
}

export { Home }
