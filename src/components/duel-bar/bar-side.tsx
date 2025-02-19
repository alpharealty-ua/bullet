import { cn } from '@/lib/utils'

const BarSide = ({
  side,
  label,
  onClickLabel,
  children,
  open,
}: {
  side: 'left' | 'right'
  label: string
  onClickLabel: (side: 'left' | 'right') => void
  children: React.ReactNode
  open: boolean
}) => {
  return (
    <div
      className={cn(
        'absolute top-0 bottom-0 flex w-full grow rounded-3xl border-2 border-black py-1 text-white transition-all duration-500',
        side === 'left' &&
          'bg-red right-full translate-x-8 flex-row-reverse rounded-ss-none rounded-es-none border-l-0',
        side === 'right' &&
          'bg-green left-full -translate-x-8 flex-row rounded-se-none rounded-ee-none border-r-0',
        open && side === 'left' && 'right-0 -translate-x-8',
        open && side === 'right' && 'left-0 translate-x-8',
      )}
    >
      <button
        className={cn(
          'relative top-0 bottom-0 z-10 flex grow-0 cursor-pointer items-center rounded-[inherit] text-xl transition-colors hover:text-black',
          side === 'left' && 'right-0',
          side === 'right' && 'left-0',
        )}
        onClick={() => onClickLabel(side)}
      >
        <div className='w-8'>
          <div
            className={cn(
              'absolute top-1/2 left-1/2 -translate-1/2 font-bold whitespace-nowrap uppercase',
              side === 'left' && 'rotate-90',
              side === 'right' && '-rotate-90',
            )}
          >
            {label}
          </div>
        </div>
      </button>
      <div
        className={cn(
          'flex grow rounded-md border-2 bg-white p-1 text-base leading-[1.1] text-black',
          side === 'left' && 'rounded-ss-none rounded-es-none border-l-0 pl-8',
          side === 'right' && 'rounded-se-none rounded-ee-none border-r-0 pr-8',
        )}
      >
        {children}
      </div>
    </div>
  )
}

export { BarSide }
