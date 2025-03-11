import { cn } from '@/lib/utils'

const Result = ({
  title,
  value,
  open,
  hasDelay = false,
}: {
  title: string
  value: string
  open: boolean
  hasDelay?: boolean
}) => {
  return (
    <div className='z-3 flex flex-col items-center gap-1 px-6'>
      <div
        className={cn(
          'fill-mode-both origin-top text-lg leading-[1] lg:text-2xl',
          open && 'animate-in fade-in slide-in-from-top-6 duration-500',
          !open && 'animate-out fade-out zoom-out-50 duration-200',
          // TODO: REFACTOR
          hasDelay && 'delay-500',
        )}
      >
        {title}
      </div>
      <div
        className={cn(
          'fill-mode-both text-red max-w-[300px] origin-top text-xl lg:text-4xl',
          open && 'animate-in fade-in slide-in-from-top-6 duration-500',
          !open && 'animate-out fade-out zoom-out-50 duration-200',
          hasDelay && 'delay-750',
        )}
      >
        {value}
      </div>
    </div>
  )
}

export { Result }
