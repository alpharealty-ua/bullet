import { useNavigate } from 'react-router'

import { useCustomModal } from '@/hooks/use-custom-modal'
import { useAppContext } from '@/context/use-app-context'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from './logo'
import { Rules } from './rules'

const Home = () => {
  const { game } = useAppContext()
  const nagigate = useNavigate()
  const modal = useCustomModal()

  const handleStartButton = async () => {
    // MOVE TO COMPONENT
    game.newGame()
    nagigate('/solo')
  }

  const handleDuelButton = async () => {
    nagigate('/duel')
  }

  const handleGameRules = async () => {
    modal.show({
      contentSlot: <Rules />,
    })
  }

  return (
    <div className='relative flex grow-1 flex-col items-center justify-center gap-10 bg-no-repeat px-3 py-12'>
      <Logo to='/' size='xl' />
      <div className='flex flex-col items-center justify-center gap-6'>
        <ButtonWithAudio
          image='duel'
          className='w-30'
          onClick={handleDuelButton}
        />
        <ButtonWithAudio
          image='solo'
          className='w-30'
          onClick={handleStartButton}
        />
        <ButtonWithAudio
          image='gamerules'
          className='w-24'
          onClick={handleGameRules}
        />
      </div>
    </div>
  )
}

export { Home }
