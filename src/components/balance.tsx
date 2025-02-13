import { cn } from '@/lib/utils'
import { useIncreaseNumber } from '@/hooks/use-increase-number'

const Balance = ({
  value,
  beforeSlot,
}: {
  value: number
  beforeSlot?: React.ReactNode
}) => {
  const { totalRef, winRef } = useIncreaseNumber(value)

  return (
    <div className='flex gap-1'>
      {beforeSlot}
      <div className='relative flex flex-col'>
        <div className='text-center text-2xl leading-[1] tracking-tight text-[#006100] uppercase'>
          Balance
        </div>
        <div className={cn('text-center text-3xl leading-[1] tracking-tight')}>
          <div ref={totalRef}></div>
        </div>
        <div
          ref={winRef}
          className={cn(
            'fill-mode-both absolute top-full right-0 left-0 hidden text-center text-3xl leading-[1] tracking-tight duration-500',
            '[&.is-in]:animate-in [&.is-in]:fade-in [&.is-in]:slide-in-from-bottom-10 [&.is-in]:block [&.is-in]:delay-200',
            '[&.is-out]:animate-out [&.is-out]:fade-out [&.is-out]:block',
          )}
        ></div>
      </div>
    </div>
  )
}

export { Balance }
