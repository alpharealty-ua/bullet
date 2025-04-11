import { Leaderboard } from '@/components/leaderboard'

const LeaderboardPage = () => {
  return (
    <>
      <div className='p-6'>
        <h1 className='mb-2 text-2xl font-bold'>Bullet Timing Leaderboard</h1>
        <p className='text-gray-500'>Population: 10,000 Players</p>
      </div>
      <Leaderboard />
    </>
  )
}

export { LeaderboardPage }
