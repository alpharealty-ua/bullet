import { Link } from 'react-router'

import { GetStatsResponse } from '@/api/leadboard.api'
import { cn } from '@/lib/utils'
import { UserSchema } from '@/lib/schemas/auth.schema'
import { getRegionFlag, getLevelColor } from '@/lib/utils'
import { ROUTES } from '@/routes/path'

interface TopPlayersProps {
  topPlayers: GetStatsResponse['topPlayers']
  user: UserSchema | null
}

const TopPlayers = ({ topPlayers, user }: TopPlayersProps) => {
  return (
    <table className='w-full divide-y divide-gray-200 text-center text-sm'>
      <thead>
        <tr className='bg-gray-50 text-gray-500 uppercase'>
          <th className='px-2 py-3 text-left font-normal whitespace-nowrap'>
            Region
          </th>
          <th className='px-2 py-3 text-left font-normal whitespace-nowrap'>
            Rank
          </th>
          <th className='px-2 py-3 text-left font-normal whitespace-nowrap'>
            Player
          </th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Country</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>LVL</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Precision</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Speed</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>
            Perfect Hit %
          </th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>
            W/L Record
          </th>
        </tr>
      </thead>
      <tbody>
        {topPlayers.map((player, i) => {
          const isUser = player.username === user?.username

          return (
            <tr
              key={player.username}
              className={cn(
                'bg-white duration-150 even:bg-gray-50 hover:bg-blue-50',
                isUser && 'bg-blue-50 hover:bg-blue-100',
              )}
            >
              <td className='px-2 py-3 text-left'>
                <div className='flex h-10 w-10 flex-1 items-center justify-center rounded-full bg-gray-100'>
                  {getRegionFlag(player.region)}
                </div>
              </td>
              <td className='px-2 py-3 text-left font-bold'>#{i + 1}</td>
              <td className='px-2 py-3 text-left'>
                <Link to={`${ROUTES.player.root}/${user?.id}`}>
                  {player.username}
                </Link>
              </td>
              <td className='px-2 py-3'>
                <span className='text-xl'>🇫🇷</span>
              </td>
              <td className='px-2 py-3'>
                <div className={getLevelColor(player.lvl)}>{player.lvl}</div>
              </td>
              <td className='px-2 py-3'>{player.precision}</td>
              <td className='px-2 py-3'>{player.speed}</td>
              <td className='px-2 py-3'>0%</td>
              <td className='px-2 py-3'>
                <span className='font-medium text-green-600'>
                  {player.wins}W
                </span>
                <span>/</span>
                <span className='font-medium text-red-600'>
                  {player.losses}L
                </span>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export { TopPlayers }
