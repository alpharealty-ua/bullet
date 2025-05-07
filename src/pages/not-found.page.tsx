import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const NotFoundPage = () => {
  return (
    <>
      <div className='flex grow flex-col justify-center gap-4 text-center'>
        <h1 className='text-3xl'>Not found</h1>
        <p className='text-lg'>Could not find requested resource</p>
        <div>
          <ButtonWithAudio as='link' to='/' className='text-lg' bg='primary'>
            Go to home page
          </ButtonWithAudio>
        </div>
      </div>
    </>
  )
}

export { NotFoundPage }
