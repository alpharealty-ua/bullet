import { cn } from '@/lib/utils'

interface MatchmakerStatisticsProps extends React.ComponentProps<'div'> {}

const MatchmakerTrophies = ({
  className,
  ...props
}: MatchmakerStatisticsProps) => {
  return (
    <div className={cn('flex w-full flex-col gap-2', className)} {...props}>
      <div className='px-2'>Trophies</div>
    </div>
  )
}

export { MatchmakerTrophies }
