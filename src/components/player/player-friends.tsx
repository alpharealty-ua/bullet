import { cn } from '@/lib/utils'

const PlayerFriends = () => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='px-2'>Friends</div>
      <div className='grid grid-cols-4 gap-1'>
        {[
          { name: 'Player', online: true },
          { name: 'Player', online: true },
          { name: 'Player', online: true },
          { name: 'Player', online: false },
          { name: 'Player', online: false },
          { name: 'Player', online: false },
          { name: 'Verylongplayername', online: false },
          { name: 'Player', online: false },
          { name: 'Player', online: false },
          { name: 'Player', online: false },
          { name: 'Player', online: false },
          { name: 'Player', online: false },
        ].map((player, i) => (
          <button
            key={i}
            className={cn(
              'max-w-30 overflow-hidden bg-white px-1 py-4 text-sm text-ellipsis',
              player.online &&
                'bg-green hover:bg-green/70 active:bg-green/80 cursor-pointer text-white shadow transition-all',
              !player.online && 'cursor-not-allowed opacity-33',
            )}
            disabled={!player.online}
            title={player.online ? 'Online' : 'Offline'}
          >
            {`${player.name}`}
          </button>
        ))}
      </div>
    </div>
  )
}

export { PlayerFriends }
