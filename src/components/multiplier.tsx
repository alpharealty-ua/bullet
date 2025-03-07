import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface MultiplerProps {
  items: number[]
  activeIndex: number
}

const Multiplier = ({ items, activeIndex }: MultiplerProps) => {
  return (
    <div className='relative text-center text-3xl leading-[1] uppercase'>
      {activeIndex === -1 && <span className='text-[#ffbf00]'>?</span>}
      &nbsp;
      {items.map((value, i) => {
        const isJackpot = value === 1000

        return (
          <div
            key={i}
            className={cn(
              'text-red absolute top-1/2 left-1/2 -translate-1/2 opacity-0 transition-opacity',
              i === activeIndex && 'opacity-100',
              isJackpot && '!text-transparent drop-shadow-none',
            )}
            // style={{ color }}
          >
            {isJackpot && (
              <div className='absolute inset-0 px-1'>
                <img src={images['1000x']} alt='' />
              </div>
            )}
            {value}x
          </div>
        )
      })}
    </div>
  )
}

export { Multiplier }
