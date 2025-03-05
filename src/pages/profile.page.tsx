import { useProfile } from '@/api/auth.api'
import { Loading } from '@/components/loading'
import { Logo } from '@/components/logo'

const ProfilePage = () => {
  const { data, isLoading, isSuccess } = useProfile()

  if (isLoading) {
    return <Loading />
  }

  if (!isSuccess) {
    return 'Error'
  }

  return (
    <>
      <header className='flex items-center justify-center px-3 py-2'>
        <Logo as='link' to='/' size='lg' />
      </header>
      <div className='flex flex-col gap-5 p-4'>
        <h3 className='text-center text-5xl'>Profile page</h3>
        <div className='flex flex-col gap-2'>
          <div>{data.email}</div>
          <div>{data.name}</div>
          <div>{data.username}</div>
          <div>{data.status}</div>
        </div>
      </div>
    </>
  )
}

export { ProfilePage }
