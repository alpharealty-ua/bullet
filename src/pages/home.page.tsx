import { ROUTES } from '@/routes/path'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from '@/components/logo'
import { Rules } from '@/components/rules'
import { LeadboardIcon } from '@/components/leadboard-icon'
import { PageWrapper } from '@/components/page-wrapper'
import { Header } from '@/components/header'

const HomePage = () => {
  const modal = useCustomModal()

  const handleGameRules = async () => {
    modal.show({
      contentSlot: <Rules />,
    })
  }

  return (
    <PageWrapper noCentered>
      <Header hideLogo />
      <div className='flex w-full grow flex-col items-center justify-center gap-10'>
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
      </div>
      <footer className='flex w-full justify-end overflow-hidden p-4'>
        {/* TODO: MAYBE ADD PORTAL  */}
        <LeadboardIcon />
      </footer>
    </PageWrapper>
  )
}

export { HomePage }
