import { cn } from '@/lib/utils'
import { UserSchema } from '@/lib/schemas/auth.schema'
import { getLevelColor } from '@/lib/utils'
import { TopPlayerListSchema } from '@/lib/schemas/leaderboard.schema'

interface TopPlayersProps {
  list: TopPlayerListSchema
  user: UserSchema | null
}

const TopPlayers = ({ list, user }: TopPlayersProps) => {
  return (
    <table className='w-full divide-y divide-gray-200 text-center text-sm'>
      <thead>
        <tr className='bg-gray-50 text-gray-500 uppercase'>
          {[
            'Rank',
            'Player',
            'LVL',
            'Precision',
            'Speed adapt',
            'Perfect Shot',
            'Win rate',
          ].map((label, i) => (
            <th key={i} className='max-w-20 px-2 py-3 text-left font-normal'>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {list.map((player, i) => {
          const isUser = player.username === user?.username

          return (
            <tr
              key={player.username}
              className={cn(
                'bg-white duration-150 even:bg-gray-50 hover:bg-blue-50',
                isUser && 'bg-blue-50 hover:bg-blue-100',
              )}
            >
              <td className='px-2 py-3 text-left font-bold'>#{i + 1}</td>
              <td className='px-2 py-3 text-left'>
                <div className='max-w-30 overflow-hidden text-ellipsis'>
                  {player.username}
                </div>
              </td>
              <td className='px-2 py-3'>
                <div className={getLevelColor(player.lvl)}>{player.lvl}</div>
              </td>
              <td className='px-2 py-3'>{player.precision}</td>
              <td className='px-2 py-3'>{player.speed}</td>
              <td className='px-2 py-3'>{player.perfectHitPercent}%</td>
              <td className='px-2 py-3'>{player.winRate}%</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export { TopPlayers }
