import { Logo } from '@/components/logo'
import { Profile } from '@/components/profile'

const ProfilePage = () => {
  return (
    <>
      <header className='flex items-center justify-center px-3 py-2'>
        <Logo as='link' to='/' size='lg' />
      </header>
      <Profile />
    </>
  )
}

export { ProfilePage }
