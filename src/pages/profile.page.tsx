import { useUser } from '@/api/auth.api'
import { Profile } from '@/components/profile'

const ProfilePage = () => {
  const user = useUser()

  return (
    <>
      <div className='flex flex-col gap-2 p-6'>
        <h1 className='text-2xl font-bold'>Profile page</h1>
      </div>
      <Profile user={user} />
    </>
  )
}

export { ProfilePage }
