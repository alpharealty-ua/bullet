import { useUserStatistics } from '@/api/leaderboard.api'
import { cn } from '@/lib/utils'
import { getPlayerStatistics } from '@/lib/schemas/leaderboard.schema'
import { Loading } from '@/components/ui/loading'
import { RequestError } from '@/components/ui/request-error'

interface MatchmakerPersonalStatisticsProps
  extends React.ComponentProps<'div'> {}

const MatchmakerPersonalStatistics = ({
  className,
  ...props
}: MatchmakerPersonalStatisticsProps) => {
  const { data: statistics, isLoading, isSuccess, error } = useUserStatistics()

  return (
    <div
      className={cn(
        'flex min-h-37 w-full flex-col gap-2 overflow-hidden',
        className,
      )}
      {...props}
    >
      <div className='px-2'>Personal statistics</div>
      {isLoading ? (
        <Loading size='sm' diration='row' />
      ) : !isSuccess ? (
        error?.message.includes('not found') ? (
          <div className='flex flex-col items-center gap-0.5 bg-white p-1 shadow'>
            Statistics not found
          </div>
        ) : (
          <RequestError error={error} />
        )
      ) : (
        <div className='custom-scroll grid grid-cols-3 gap-1'>
          <div className='flex flex-col items-center gap-0.5 bg-white p-1 shadow'>
            <div className='text-xl'>
              <span className='text-green font-medium'>
                {statistics.gamesWon}W
              </span>
              <span>/</span>
              <span className='text-red font-medium'>
                {statistics.gamesLost}L
              </span>
            </div>
            <div className='text-xs text-[#7f8c8d]'>Record</div>
          </div>
          {getPlayerStatistics(statistics).map(({ value, label }, i) => (
            <div
              key={i}
              className='flex flex-col items-center gap-0.5 bg-white p-1 shadow'
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
