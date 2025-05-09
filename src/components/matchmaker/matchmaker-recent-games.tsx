import { useUserStatistics } from '@/api/leaderboard.api'
import { cn } from '@/lib/utils'
import { Loading } from '@/components/ui/loading'
import { RequestError } from '@/components/ui/request-error'

interface MatchmakerPersonalStatisticsProps
  extends React.ComponentProps<'div'> {}

const MatchmakerPersonalRecentGames = ({
  className,
  ...props
}: MatchmakerPersonalStatisticsProps) => {
  const {
    data: playerStatistics,
    isLoading,
    isSuccess,
    error,
  } = useUserStatistics()

  return (
    <div
      className={cn(
        'flex min-h-40 w-full flex-col gap-2 overflow-hidden',
        className,
      )}
      {...props}
    >
      <div className='px-2'>Recent games</div>
      {isLoading ? (
        <Loading size='sm' diration='row' />
      ) : !isSuccess ? (
        error?.message.includes('not found') ? (
          <div className='flex flex-col items-center gap-1 bg-white p-1 shadow'>
            Statistics not found
          </div>
        ) : (
          <RequestError error={error} />
        )
      ) : (
        <div className='custom-scroll grow'>
          <table className='w-full divide-y divide-gray-200 text-center text-sm'>
            <thead>
              <tr className='sticky top-0 bg-gray-50 text-gray-500 uppercase'>
                {['Result', 'Opponent', 'Date', 'LVL change'].map(
                  (label, i) => (
                    <th key={i} className='p-1 font-normal'>
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {playerStatistics.recentGames.map((game, index) => (
                <tr
                  key={index}
                  className='bg-white transition-colors even:bg-gray-50 hover:bg-blue-50'
                >
                  <td
                    className={cn(
                      'p-1',
                      game.result === 'win' ? 'text-green' : 'text-red',
                    )}
                  >
                    {game.result}
                  </td>
                  <td className='p-1'>
                    <div className='max-w-30 overflow-hidden text-ellipsis'>
                      {game.opponentUsername}
                    </div>
                  </td>
                  <td className='p-1'>
                    {new Date(game.date).toLocaleDateString('en-US')}
                  </td>
                  <td className='p-1'>{game.opponentScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export { MatchmakerPersonalRecentGames }
