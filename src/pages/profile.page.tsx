import { Profile } from '@/components/profile'

const ProfilePage = () => {
  return (
    <main className='flex grow flex-col overflow-hidden'>
      <div className='flex flex-col gap-2 p-6'>
        <h1 className='text-2xl font-bold'>Profile page</h1>
      </div>
      <Profile />
    </main>
  )
}

export { ProfilePage }
