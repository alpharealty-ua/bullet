import { useRouteError } from 'react-router'

import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const ErrorPage = () => {
  const data = useRouteError()

  const message =
    typeof data === 'object' &&
    data &&
    'message' in data &&
    (data.message as string)

  return (
    <>
      <div className='flex grow flex-col justify-center gap-4 text-center'>
        <h3 className='text-3xl'>Opps, something went wrong!</h3>
        {message && <h4 className='text-xl'>{message}</h4>}
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
    </>
  )
}

export { ErrorPage }
