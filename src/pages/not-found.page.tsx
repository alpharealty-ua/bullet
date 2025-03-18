import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const NotFoundPage = () => {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-4 px-3 py-2 text-center'>
      <h1 className='text-3xl'>Not found</h1>
      <p className='lg:text-lg'>Could not find requested resource</p>
      <ButtonWithAudio
        as='link'
        to='/'
        className='text-lg'
        text='Go to home page'
        bg='primary'
      />
    </div>
  )
}

export { NotFoundPage }
