import { Profile } from '@/components/profile'

const ProfilePage = () => {
  return (
    <main className='flex grow flex-col overflow-hidden'>
      <div className='flex flex-col gap-2 px-2 py-4'>
        <h1 className='text-2xl font-bold'>Profile page</h1>
      </div>
      <Profile />
    </main>
  )
}

export { ProfilePage }
