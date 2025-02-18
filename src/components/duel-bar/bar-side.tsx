import { cn } from '@/lib/utils'

export const BarSide = ({
  side,
  label,
  onClickButton,
  children,
}: {
  side: 'left' | 'right'
  label: string
  onClickButton: () => void
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'relative flex grow rounded-3xl border-2 border-black py-1 text-white',
        side === 'left' &&
          'flex-row-reverse rounded-ss-none rounded-es-none border-l-0 bg-[#ff0000]',
        side === 'right' &&
          'flex-row rounded-se-none rounded-ee-none border-r-0 bg-[#006100]',
      )}
    >
      <button
        className={cn(
          'relative top-0 bottom-0 z-10 flex grow cursor-pointer items-center rounded-[inherit] text-xl transition-colors hover:text-black',
          side === 'left' && 'right-0',
          side === 'right' && 'left-0',
        )}
        onClick={onClickButton}
      >
        <div className='w-7'>
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
          'flex w-[345px] rounded-md border-2 bg-white p-1 text-base leading-[1.1] text-black',
          side === 'left' && 'rounded-ss-none rounded-es-none border-l-0 pl-0',
          side === 'right' && 'rounded-se-none rounded-ee-none border-r-0 pr-0',
        )}
      >
        {children}
      </div>
    </div>
  )
}
