import { cn } from '@/lib/utils'

interface MultiplerProps {
  items: number[]
  activeIndex: number
}

const Multiplier = ({ items, activeIndex }: MultiplerProps) => {
  return (
    <>
      <div className={cn('flex flex-col items-center text-center')}>
        <div className='relative text-center text-4xl leading-[1] text-[#ff0b0b] uppercase'>
          {activeIndex === -1 && '?'}
          &nbsp;
          {items.map((el, i) => {
            return (
              <div
                key={i}
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-1/2 opacity-0 transition-opacity',
                  i === activeIndex && 'opacity-100',
                )}
              >
                {el}x
              </div>
            )
          })}
        </div>
        <div className='text-lg text-[#006100] uppercase'>MULTIPLIER</div>
      </div>
    </>
  )
}

export { Multiplier }
