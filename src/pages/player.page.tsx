import { useParams } from 'react-router'

import { PlayerProfile } from '@/components/player/player-profile'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const PlayerPage = () => {
  const { playerId } = useParams() as { playerId: string }

  return (
    <main className='grow'>
      <div className='flex items-center justify-between gap-2 px-2 py-4'>
        <h1 className='text-2xl font-bold'>Player page</h1>
        <ButtonWithAudio as='button' bg='green' className='text-sm'>
          Add to friends
        </ButtonWithAudio>
      </div>
      <PlayerProfile playerId={playerId} />
    </main>
  )
}

export { PlayerPage }
