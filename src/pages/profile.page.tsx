import { useUser } from '@/api/auth.api'
import { Logo } from '@/components/logo'
import { PageWrapper } from '@/components/page-wrapper'
import { Profile } from '@/components/profile'

const ProfilePage = () => {
  const user = useUser()

  return (
    <PageWrapper>
      <Logo as='link' to='/' size='xl' />
      <Profile user={user} />
    </PageWrapper>
  )
}

export { ProfilePage }
