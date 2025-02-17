import { cn } from '@/lib/utils'

const Round = ({ value }: { value: number }) => {
  return (
    <>
      <div className={cn('flex flex-col items-center text-center')}>
        <div className='text-xl font-bold text-[#006100] uppercase'>Round</div>
        <div className='relative text-center text-3xl leading-[1] text-[#ff0b0b] uppercase'>
          {value}
        </div>
      </div>
    </>
  )
}

export { Round }
