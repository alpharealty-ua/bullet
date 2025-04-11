import { GetStatsResponse } from '@/api/leadboard.api'
import { cn } from '@/lib/utils'
import {
  getRegionFlag,
  FlagKeys,
  getFlagColor,
} from '@/components/leaderboard/utils'

const TopPlayers = ({
  topPlayers,
  user,
}: {
  topPlayers: GetStatsResponse['topPlayers']
  user: User | null
}) => {
  return (
    <table className='w-full divide-y divide-gray-200'>
      <thead>
        <tr className='bg-gray-50'>
          <th
            scope='col'
            className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
          >
            Rank
          </th>
          <th
            scope='col'
            className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
          >
            Player
          </th>
          <th
            scope='col'
            className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
          >
            LVL
          </th>
          <th
            scope='col'
            className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
          >
            Precision
          </th>
          <th
            scope='col'
            className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
          >
            Consistency
          </th>
          <th
            scope='col'
            className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
          >
            Speed
          </th>
          <th
            scope='col'
            className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
          >
            W/L
          </th>
        </tr>
      </thead>
      <tbody className='divide-y divide-gray-200 bg-white'>
        {topPlayers.map((player) => {
          const isPlayer = player.username === user?.username

          return (
            <tr
              key={player.username}
              className={cn(
                'hover:bg-gray-50',
                isPlayer && 'bg-blue-50 hover:bg-blue-100',
              )}
            >
              <td className='px-2 py-3 text-sm font-medium whitespace-nowrap text-gray-900'>
                #{player.rank}
              </td>
              <td className='px-2 py-3 whitespace-nowrap'>
                <div className='flex items-center'>
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100'>
                    {getRegionFlag(player.region as FlagKeys)}
                  </div>
                  <div className='ml-4'>
                    <div className='text-sm font-medium text-gray-900'>
                      {player.username}
                    </div>
                    <div className='text-sm text-gray-500'>{player.region}</div>
                  </div>
                </div>
              </td>
              <td className='px-2 py-3 whitespace-nowrap'>
                <div
                  className='text-sm font-bold text-gray-900'
                  style={{ color: getFlagColor(player.lvl) }}
                >
                  {player.lvl}
                </div>
              </td>
              <td className='px-2 py-3 whitespace-nowrap'>
                <div className='text-sm text-gray-900'>{player.precision}</div>
              </td>
              <td className='px-2 py-3 whitespace-nowrap'>
                <div className='text-sm text-gray-900'>
                  {player.consistency}
                </div>
              </td>
              <td className='px-2 py-3 whitespace-nowrap'>
                <div className='text-sm text-gray-900'>{player.speed}</div>
              </td>
              <td className='px-2 py-3 text-sm whitespace-nowrap text-gray-500'>
                {player.wins}W / {player.losses}L
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export { TopPlayers }
