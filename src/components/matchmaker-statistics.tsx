import { Statistics } from '@/socket/matchmaker/matchmaker-soket.types'
import { cn } from '@/lib/utils'

interface MatchmakerStatisticsProps extends React.ComponentProps<'div'> {
  statistics: Statistics
}

const MatchmakerStatistics = ({
  statistics,
  className,
  ...props
}: MatchmakerStatisticsProps) => {
  return (
    <div className={cn('flex w-full flex-col gap-2', className)} {...props}>
      <div className='px-2'>Statistics</div>
      <div className='flex gap-1'>
        {[
          {
            value: statistics.playersInQueue,
            label: 'Players in Queue',
          },
          {
            value: statistics.totalMatches,
            label: 'Total Matches',
          },
          {
            value: statistics.averageWaitTime,
            label: 'Avg. Wait Time (ms)',
          },
        ].map((el, i) => (
          <div
            key={i}
            className='flex flex-1 flex-col items-center gap-1 bg-white p-1 shadow'
          >
            <div className='text-xl'>{el.value}</div>
            <div className='text-xs text-[#7f8c8d]'>{el.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { MatchmakerStatistics }
