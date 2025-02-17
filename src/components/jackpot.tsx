import { cn } from '@/lib/utils'

const Jackpot = ({ value }: { value: number }) => {
  return (
    <>
      <div className={cn('flex flex-col items-center text-center')}>
        <div className='text-xl font-bold text-[#006100] uppercase'>
          Jackpot
        </div>
        <div className='relative text-center text-3xl leading-[1] uppercase'>
          ${value}
        </div>
      </div>
    </>
  )
}

export { Jackpot }
