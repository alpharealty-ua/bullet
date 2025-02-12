import { cn } from '@/lib/utils'
import { useIncreaseNumber } from '@/hooks/increase-number'

const Balance = ({
  value,
  beforeSlot,
}: {
  value: number
  beforeSlot?: React.ReactNode
}) => {
  const { textRef } = useIncreaseNumber(value)

  return (
    <div className='flex gap-1'>
      {beforeSlot}
      <div className='flex flex-col'>
        <div className='text-center text-2xl leading-[1] tracking-tight text-[#006100] uppercase'>
          Balance
        </div>
        <div
          ref={textRef}
          className={cn('text-center text-3xl leading-[1] tracking-tight')}
        ></div>
      </div>
    </div>
  )
}

export { Balance }
