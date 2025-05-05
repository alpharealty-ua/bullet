import { useParams } from 'react-router'

import { PlayerProfile } from '@/components/leaderboard/player-profile'

const PlayerPage = () => {
  const { playerId } = useParams() as { playerId: string }

  return (
    <main className='grow'>
      <div className='flex flex-col gap-2 p-6'>
        <h1 className='text-2xl font-bold'>Player page</h1>
      </div>
      <PlayerProfile playerId={playerId} />
    </main>
  )
}

export { PlayerPage }
