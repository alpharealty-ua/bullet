import { Leaderboard } from '@/components/leaderboard/leaderboard'

const LeaderboardPage = () => {
  return (
    <main className='grow'>
      <div className='flex flex-col gap-2 px-2 py-4'>
        <h1 className='text-2xl font-bold'>Bullet Timing Leaderboard</h1>
      </div>
      <Leaderboard />
    </main>
  )
}

export { LeaderboardPage }
