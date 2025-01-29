import { images } from '@/lib/constants'
import classNames from 'classnames'

interface MultiplerProps {
  items: number[]
  activeIndex: number
}

const Multiplier = ({ items, activeIndex }: MultiplerProps) => {
  return (
    <>
      <div className={classNames('flex flex-col items-center text-center')}>
        <div className='relative text-center text-4xl leading-[1] font-black text-[#ff0b0b]'>
          {activeIndex === -1 && '?'}
          &nbsp;
          {items.map((el, i) => {
            return (
              <div
                key={i}
                className={classNames(
                  'absolute top-1/2 left-1/2 -translate-1/2 opacity-0 transition-opacity',
                  i === activeIndex && 'opacity-100',
                )}
              >
                {el}x
              </div>
            )
          })}
        </div>
        <div
          className='h-[16px] w-[86px] bg-cover font-bold text-[#006100] uppercase'
          style={{ backgroundImage: `url(${images.multiplier})` }}
        ></div>
      </div>
    </>
  )
}

export { Multiplier }
