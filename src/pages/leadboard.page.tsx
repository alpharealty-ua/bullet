import { Logo } from '@/components/logo'
import { Leaderboard } from '@/components/leaderboard'

const LeaderboardPage = () => {
  return (
    <>
      <header className='flex items-center justify-center px-3 py-2'>
        <Logo as='link' to='/' size='lg' />
      </header>
      <Leaderboard />
    </>
  )
}

export { LeaderboardPage }
