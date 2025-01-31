import { images } from '@/lib/constants'

const Bet = ({ value }: { value: string }) => {
  return (
    <div className='flex min-w-[75px] flex-col items-center text-center'>
      <div className='w-full overflow-hidden text-3xl leading-[1] text-ellipsis text-[#ff0b0b]'>
        {value}
      </div>
      <div className='bg-center text-lg text-[#006100] uppercase'>Bet</div>
    </div>
  )
}

export { Bet }
