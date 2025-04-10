import { useUser } from '@/api/auth.api'
import { Logo } from '@/components/logo'
import { Profile } from '@/components/profile'

const ProfilePage = () => {
  const user = useUser()

  return (
    <>
      <Logo as='link' to='/' size='xl' />
      <Profile user={user} />
    </>
  )
}

export { ProfilePage }
