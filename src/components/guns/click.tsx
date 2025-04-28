import { cn } from '@/lib/utils'

const Click = ({
  leftClick: { className: leftClickClassName, ...leftClickProps } = {},
  rightClick: { className: rightClickClassName, ...rightClickProps } = {},
}: {
  leftClick?: React.HTMLAttributes<HTMLDivElement>
  rightClick?: React.HTMLAttributes<HTMLDivElement>
}) => {
  return (
    <>
      <div
        className={cn(
          'absolute top-0 right-1/2 aspect-[3/1] w-1/2 min-w-6 -rotate-[45deg] tracking-wider opacity-0',
          leftClickClassName,
        )}
        {...leftClickProps}
        data-click
      >
        <svg viewBox='0 0 60 21' preserveAspectRatio='xMinYMid meet'>
          <text x='0' y='15' fontSize='16px' fill='black'>
            click!
          </text>
        </svg>
      </div>
      <div
        className={cn(
          'absolute top-0 left-1/2 aspect-[3/1] w-1/2 min-w-6 rotate-[45deg] tracking-wider opacity-0',
          rightClickClassName,
        )}
        {...rightClickProps}
        data-click
      >
        <svg viewBox='0 0 60 21' preserveAspectRatio='xMinYMid meet'>
          <text x='0' y='15' fontSize='16px' fill='black'>
            click!
          </text>
        </svg>
      </div>
    </>
  )
}

export { Click }
