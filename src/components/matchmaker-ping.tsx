import { cn } from '@/lib/utils'
import { PingData } from '@/socket/matchmaker/matchmaker-soket.types'

interface MatchmakerPing extends React.ComponentProps<'div'> {
  pingData: PingData
}

const MatchmakerPing = ({ pingData, className, ...props }: MatchmakerPing) => {
  return (
    <div className={cn('flex w-full flex-col gap-2', className)} {...props}>
      <div className='px-2'>Your Connection</div>
      <div
        className={cn(
          'flex items-center justify-center p-1 text-xs',
          pingData.ping && 'bg-[#f8d7da] text-[#721c24]',
          pingData.ping < 200 && 'bg-[#fff3cd] text-[#856404]',
          pingData.ping < 100 && 'bg-[#d4edda] text-[#155724]',
          pingData.ping === 0 && 'bg-[#fff3cd]',
        )}
      >
        {pingData.ping === 0
          ? 'Measuring Ping: -- ms'
          : `Current Ping: ${pingData.ping} ms`}
      </div>
      <div className='flex gap-1'>
        {[
          {
            label: 'Jitter',
            value: `${pingData.jitter ?? '--'} ms`,
          },
          {
            label: 'Measurements',
            value: `${pingData.measurements ?? '--'}`,
          },
          {
            label: 'Last Sequence',
            value: `${pingData.sequence ?? '--'}`,
          },
        ].map((el, i) => (
          <div
            key={i}
            className='flex-1 bg-white p-1 text-center text-[0.625rem] shadow'
          >
            {el.label}: {el.value}
          </div>
        ))}
      </div>
      <div className='relative flex h-20 items-end justify-end gap-1 bg-[#f8f9fa]'>
        {[
          ...Array(Math.max(20 - pingData.history.length, 0))
            .fill(0)
            .map((_, i) => ({ ping: 0, jitter: 0, timestamp: i })),
          ...pingData.history,
        ].map((entry) => {
          const MAX_PING = 300
          const pingValue = Math.min(entry.ping, MAX_PING)

          const height = pingValue / MAX_PING
          return (
            <div
              key={entry.timestamp}
              className={cn(
                'h-full flex-1 rounded-sm bg-[#e74c3c]',
                entry.ping < 200 && 'bg-[#f39c12]',
                entry.ping < 100 && 'bg-[#2ecc71]',
              )}
              style={{
                height: `${height * 100}%`,
              }}
              title={`Ping: ${entry.ping}ms, Jitter: ${entry.jitter}ms`}
            ></div>
          )
        })}
        <div className='text-red border-red absolute right-0 bottom-1/3 left-0 border-t text-right text-[0.438rem]'>
          <span className='absolute top-0.5 right-0'>100ms</span>
        </div>
        <div className='text-red border-red absolute right-0 bottom-2/3 left-0 border-t text-right text-[0.438rem]'>
          <span className='absolute top-0.5 right-0'>200ms</span>
        </div>
        <div className='text-red border-red absolute right-0 bottom-3/3 left-0 border-t text-right text-[0.438rem]'>
          <span className='absolute top-0.5 right-0'>300ms</span>
        </div>
      </div>
    </div>
  )
}

export { MatchmakerPing }
