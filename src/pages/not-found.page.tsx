import { Header } from '@/components/header'
import { PageWrapper } from '@/components/page-wrapper'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const NotFoundPage = () => {
  return (
    <PageWrapper noCentered>
      <Header />
      <div className='flex grow flex-col justify-center gap-4 text-center'>
        <h1 className='text-3xl'>Not found</h1>
        <p className='text-lg'>Could not find requested resource</p>
        <div>
          <ButtonWithAudio
            as='link'
            to='/'
            className='text-lg'
            text='Go to home page'
            bg='primary'
          />
        </div>
      </div>
    </PageWrapper>
  )
}

export { NotFoundPage }
