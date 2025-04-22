import { ROUTES } from '@/routes/path'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from '@/components/logo'
import { Rules } from '@/components/rules'
import { SettingsButton } from '@/components/ui/settings-button'
import { LeaderboardButton } from '@/components/ui/leaderboard-button'

const HomePage = () => {
  const modal = useCustomModal()

  const handleGameRules = async () => {
    modal.show({
      contentSlot: <Rules />,
    })
  }

  return (
    <>
      <main className='flex w-full grow flex-col items-center justify-center gap-10'>
        <Logo as='div' size='xl' />
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
      </main>
    </>
  )
}

export { HomePage }
