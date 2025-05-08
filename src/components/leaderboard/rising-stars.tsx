import { UserSchema } from '@/lib/schemas/auth.schema'
import { RisingStarListchema } from '@/lib/schemas/leaderboard.schema'
import { cn } from '@/lib/utils'

interface RisingStarsProps {
  list: RisingStarListchema
  user: UserSchema | null
}

const RisingStars = ({ list, user }: RisingStarsProps) => {
  return (
    <table className='w-full divide-y divide-gray-200 text-center text-sm'>
      <thead>
        <tr className='bg-gray-50 text-gray-500 uppercase'>
          <th className='px-2 py-3 text-left font-normal whitespace-nowrap'>
            Player
          </th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Country</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>LVL</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Precision</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Speed</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>
            Perfect Shot
          </th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Record</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Games</th>
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
                <div className='max-w-30 overflow-hidden text-ellipsis'>
                  {player.name}
                </div>
              </td>
              <td className='px-2 py-3'>
                <span className='text-xl'>{player.flag}</span>
              </td>
              <td className='px-2 py-3'>{player.lvl}</td>
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
              <td className='px-2 py-3'>{player.totalGames}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
export { RisingStars }
