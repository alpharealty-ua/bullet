import classNames from 'classnames'

interface MultiplerProps {
  items: number[]
  activeIndex: number
}

const Multiplier = ({ items, activeIndex }: MultiplerProps) => {
  return (
    <>
      <div className={classNames('flex flex-col text-center')}>
        <div className='relative text-center text-5xl leading-[1] font-black text-[#ff0b0b]'>
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
        <div className='h-[16px] w-[86px] bg-[url(/assets/images/multiplier.png)] bg-cover font-bold text-[#006100] uppercase'></div>
      </div>
    </>
  )
}

export { Multiplier }
