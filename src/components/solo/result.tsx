import { cn } from '@/lib/utils'

// TODO: RED ADD HANDLE
interface ResultProps {
  title: string
  value: string
  open: boolean
}

const Result = ({ title, value, open }: ResultProps) => {
  return (
    <div
      className={cn(
        'flex origin-top flex-col items-center gap-1 opacity-0',
        'fill-mode-both',
        open &&
          'animate-in fade-in slide-in-from-top-6 opacity-100 duration-500',
        !open && 'animate-out fade-out zoom-out-50 duration-200',
      )}
    >
      <div className='text-xl leading-[1] lg:text-2xl'>{title}</div>
      <div className='text-red max-w-75 text-2xl lg:text-4xl'>{value}</div>
    </div>
  )
}

export { Result }
