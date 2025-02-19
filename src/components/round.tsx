import { cn } from '@/lib/utils'

const Round = ({ value }: { value: number }) => {
  return (
    <>
      <div className={cn('flex flex-col items-center text-center')}>
        <div className='text-green text-xl font-bold uppercase'>Round</div>
        <div className='text-red relative text-center text-3xl leading-[1] uppercase'>
          {value}
        </div>
      </div>
    </>
  )
}

export { Round }
