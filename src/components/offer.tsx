import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

const Offer = ({
  jackpot,
  open,
  close,
}: {
  jackpot: boolean
  open: boolean
  close: boolean
}) => {
  return (
    <div className='z-3 flex flex-col items-center gap-3 px-6 pt-3'>
      <div
        className={cn(
          'fill-mode-both origin-top text-2xl leading-[1] font-bold',
          open && 'animate-in fade-in zoom-in-50 delay-500 duration-500',
          close && 'animate-out fade-out zoom-out-50 delay-200 duration-200',
        )}
      >
        {jackpot ? 'Jackpot' : ' the banker offers...'}
      </div>
      <div
        className={cn(
          'fill-mode-both max-w-[300px] text-6xl text-[#006100] drop-shadow-[2px_1px_0px_#000]',
          open && 'animate-in fade-in delay-1000 duration-1000',
          close && 'animate-out fade-out duration-200',
        )}
      >
        {jackpot ? <img src={images['100000$']} alt='' /> : '$100'}
      </div>
    </div>
  )
}

export { Offer }
