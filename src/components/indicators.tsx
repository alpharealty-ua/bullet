import { cn } from '@/lib/utils'

const Indicators = ({ indicators }: { indicators: { confirm: boolean }[] }) => {
  return (
    <div className='flex items-center justify-center gap-2'>
      {indicators.map((indicator, i) => (
        <div
          key={i}
          className={cn(
            'border-primary h-6 w-6 rounded-full border bg-[#ecf0f1] shadow-lg',
            indicator.confirm && 'border-transparent bg-[#2ecc71]',
          )}
        ></div>
      ))}
    </div>
  )
}

export { Indicators }
