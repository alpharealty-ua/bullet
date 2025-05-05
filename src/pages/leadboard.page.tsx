import { Leaderboard } from '@/components/leaderboard/leaderboard'

const LeaderboardPage = () => {
  return (
    <main className='grow'>
      <div className='flex flex-col gap-2 p-6'>
        <h1 className='text-2xl font-bold'>Bullet Timing Leaderboard</h1>
        <p className='text-gray-500'>Population: 10,000 Players</p>
      </div>
      <Leaderboard />
    </main>
  )
}

export { LeaderboardPage }
