import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface MultiplerProps {
  items: number[]
  activeIndex: number
}

const Multiplier = ({ items, activeIndex }: MultiplerProps) => {
  return (
    <>
      <div className={cn('flex flex-col items-center text-center')}>
        <div className='text-lg font-bold text-[#006100] uppercase'>
          MULTIPLIER
        </div>
        <div className='relative text-center text-4xl leading-[1] uppercase'>
          {activeIndex === -1 && (
            <span className='text-[#ffbf00] drop-shadow-[2px_1px_0px_#000]'>
              ?
            </span>
          )}
          &nbsp;
          {items.map((el, i) => {
            const isJackpot = el === 1000

            return (
              <div
                key={i}
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-1/2 text-[#ff0b0b] opacity-0 drop-shadow-[2px_1px_0px_#000] transition-opacity',
                  i === activeIndex && 'opacity-100',
                  isJackpot && 'text-transparent drop-shadow-none',
                )}
              >
                {isJackpot && (
                  <div className='absolute inset-0 px-1'>
                    <img src={images['1000x']} alt='' />
                  </div>
                )}
                {el}x
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export { Multiplier }
