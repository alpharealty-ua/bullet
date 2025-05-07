import { cn } from '@/lib/utils'

export type Indicator = 'confirm' | 'cancel' | 'init'

type IndicatorsProps = {
  indicators: Indicator[]
} & React.ComponentProps<'div'>

const Indicators = ({ indicators, className, ...props }: IndicatorsProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-tr-2xl border-3 border-black',
        className,
      )}
      {...props}
    >
      {indicators.map((indicator, i) => (
        <div
          key={i}
          className={cn(
            'bg-primary h-7 w-full border-t-4 border-black shadow-lg first:h-6 first:rounded-tr-xl first:border-t-0',
            indicator === 'confirm' && 'bg-green',
            indicator === 'cancel' && 'bg-red',
          )}
        ></div>
      ))}
    </div>
  )
}

export { Indicators }
