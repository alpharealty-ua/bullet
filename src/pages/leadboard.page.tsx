import { Leaderboard } from '@/components/leaderboard'
import { Header } from '@/components/header'

const LeaderboardPage = () => {
  return (
    <>
      <Header />
      <div className='p-6'>
        <h1 className='mb-2 text-2xl font-bold'>Bullet Timing Leaderboard</h1>
        <p className='text-gray-500'>Population: 10,000 Players</p>
      </div>
      <Leaderboard />
    </>
  )
}

export { LeaderboardPage }
