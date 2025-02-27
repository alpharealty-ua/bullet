import { useNavigate } from 'react-router'

import { useCustomModal } from '@/hooks/use-custom-modal'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from './logo'
import { Rules } from './rules'
import { ROUTES } from '@/routes/path'

const Home = () => {
  const nagigate = useNavigate()
  const modal = useCustomModal()

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
  handleSoloButton

  const handleLoginClick = () => {
    nagigate(ROUTES.login)
  }

  const handleRegisterClick = () => {
    nagigate(ROUTES.resiter)
  }

  const isLogin = false

  return (
    <div className='relative flex grow-1 flex-col items-center justify-center gap-10 px-3 py-12'>
      <Logo to='/' size='xl' />
      {isLogin ? (
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
