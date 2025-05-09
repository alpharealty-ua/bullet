import { UserSchema } from '@/lib/schemas/auth.schema'
import {
  getPlayerStatistics as getPlayerStatistics,
  PlayerStatisticsSchema,
} from '@/lib/schemas/leaderboard.schema'

interface PlayerStatisticsProps {
  statistics: PlayerStatisticsSchema
  user?: UserSchema | null
}

export const PlayerStatistics = ({
  statistics: list,
  user,
}: PlayerStatisticsProps) => {
  return (
    <>
      <table className='w-full divide-y divide-gray-200 text-center text-sm'>
        <tbody>
          {user && (
            <>
              <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                <td className='px-2 py-3 font-semibold text-gray-500'>
                  Username
                </td>
                <td className='px-2 py-3'>{user.username}</td>
              </tr>
              <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                <td className='px-2 py-3 font-semibold text-gray-500'>Email</td>
                <td className='px-2 py-3'>{user.email}</td>
              </tr>
            </>
          )}
          <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
            <td className='px-2 py-3 font-semibold text-gray-500'>Record</td>
            <td className='px-2 py-3 font-medium'>
              <span className='text-green-600'>{list.gamesWon}W</span>/
              <span className='text-red-600'>{list.gamesLost}L</span>
            </td>
          </tr>
          {getPlayerStatistics(list).map(({ label, value }, i) => (
            <tr
              key={i}
              className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'
            >
              <td className='px-2 py-3 font-semibold text-gray-500'>{label}</td>
              <td className='px-2 py-3'>{Number(value.toFixed(2))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
