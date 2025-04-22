import { useUserStatistics } from '@/api/leaderboard.api'
import { cn } from '@/lib/utils'
import { Loading } from '@/components/loading'
import { Notification } from '@/components/ui/notification'

interface MatchmakerPersonalStatisticsProps
  extends React.ComponentProps<'div'> {}

const MatchmakerPersonalStatistics = ({
  className,
  ...props
}: MatchmakerPersonalStatisticsProps) => {
  const {
    data: userStatistics,
    isLoading,
    isSuccess,
    error,
  } = useUserStatistics()

  return (
    <div className={cn('flex w-full flex-col gap-2', className)} {...props}>
      <div className='px-2'>Personal statistics</div>
      {isLoading ? (
        <Loading />
      ) : !isSuccess ? (
        error?.message.includes('not found') ? (
          <div className='flex flex-col items-center gap-1 bg-white p-1 shadow'>
            Statistics not found
          </div>
        ) : (
          <Notification type='error' message={error?.message} />
        )
      ) : (
        <div className='grid grid-cols-3 gap-1'>
          <div className='flex flex-col items-center gap-1 bg-white p-1 shadow'>
            <div className='text-xl'>
              <span className='font-medium text-green-600'>
                {userStatistics.gamesWon}W
              </span>
              <span>/</span>
              <span className='font-medium text-red-600'>
                {userStatistics.gamesLost}L
              </span>
            </div>
            <div className='text-xs text-[#7f8c8d]'>Record</div>
          </div>
          {[
            {
              label: 'Total games',
              value: userStatistics.totalGames,
            },
            {
              label: 'Win rate',
              value: userStatistics.winRate,
            },
            {
              label: 'Lvl',
              value: userStatistics.lvl,
            },
            {
              label: 'Percentile',
              value: userStatistics.percentile,
            },
            {
              label: 'Perfect Hit %',
              value: userStatistics.perfectHitRate,
            },
            {
              label: 'Rank',
              value: userStatistics.rank,
            },
          ].map(({ value, label }, i) => (
            <div
              key={i}
              className='flex flex-col items-center gap-1 bg-white p-1 shadow'
            >
              <div className='text-xl'>{Number(value.toFixed(2))}</div>
              <div className='text-xs text-[#7f8c8d]'>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { MatchmakerPersonalStatistics }
