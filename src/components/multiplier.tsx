import classNames from 'classnames'

interface MultiplerProps {
  items: number[]
  activeIndex: number
}

const Multipler = ({ items, activeIndex }: MultiplerProps) => {
  return (
    <>
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
    </>
  )
}

export { Multipler }
