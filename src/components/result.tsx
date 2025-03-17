import { cn } from '@/lib/utils'

const Result = ({
  title,
  value,
  open,
}: {
  title: string
  value: string
  open: boolean
}) => {
  return (
    <div className='flex flex-col items-center gap-1 px-6'>
      <div
        className={cn(
          'fill-mode-both origin-top text-xl leading-[1] opacity-0 lg:text-2xl',
          open &&
            'animate-in fade-in slide-in-from-top-6 opacity-100 duration-500',
          !open && 'animate-out fade-out zoom-out-50 duration-200',
        )}
      >
        {title}
      </div>
      <div
        className={cn(
          'fill-mode-both text-red max-w-[300px] origin-top text-2xl opacity-0 lg:text-4xl',
          open &&
            'animate-in fade-in slide-in-from-top-6 opacity-100 duration-500',
          !open && 'animate-out fade-out zoom-out-50 duration-200',
        )}
      >
        {value}
      </div>
    </div>
  )
}

export { Result }
