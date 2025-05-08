import { cn } from '@/lib/utils'
import { UserSchema } from '@/lib/schemas/auth.schema'
import { getLevelColor, getRegionFlag } from '@/lib/utils'
import { RegionalChampionListchema } from '@/lib/schemas/leaderboard.schema'

interface RegionalChampionsProps {
  list: RegionalChampionListchema
  user: UserSchema | null
}

const RegionalChampions = ({ list, user }: RegionalChampionsProps) => {
  return (
    <table className='w-full divide-y divide-gray-200 text-center text-sm'>
      <thead>
        <tr className='bg-gray-50 text-gray-500'>
          <th className='px-2 py-3 text-left font-normal whitespace-nowrap'>
            Region
          </th>
          <th className='px-2 py-3 text-left font-normal whitespace-nowrap'>
            Champion
          </th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Country</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>LVL</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Precision</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Speed</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>
            Perfect Shot
          </th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>
            W/L Record
          </th>
        </tr>
      </thead>
      <tbody>
        {list.map((player) => {
          const isUser = player.name === user?.username

          return (
            <tr
              key={player.name}
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
              <td className='px-2 py-3 text-left'>
                <div className='max-w-30 overflow-hidden text-ellipsis'>
                  {player.name}
                </div>
              </td>
              <td className='px-2 py-3'>
                <span className='text-xl'>{player.flag}</span>
              </td>
              <td className='px-2 py-3'>
                <div className={getLevelColor(player.lvl)}>{player.lvl}</div>
              </td>
              <td className='px-2 py-3'>{player.precision}</td>
              <td className='px-2 py-3'>{player.speed}</td>
              <td className='px-2 py-3'>{player.perfectHitPercent}%</td>
              <td className='px-2 py-3 whitespace-nowrap'>
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

export { RegionalChampions }
