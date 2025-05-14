import { TROPHY_IMAGES_SRC_LIST } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface MatchmakerStatisticsProps extends React.ComponentProps<'div'> {}

const MatchmakerTrophies = ({
  className,
  ...props
}: MatchmakerStatisticsProps) => {
  return (
    <div
      className={cn('flex min-h-25 flex-col gap-2 overflow-hidden', className)}
      {...props}
    >
      <div className='px-2'>Trophies</div>
      <div className='custom-scroll grid min-h-18 grid-cols-6 gap-0.5'>
        {TROPHY_IMAGES_SRC_LIST.map((image, i) => {
          return (
            <div key={i}>
              <img src={image} alt='' />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { MatchmakerTrophies }
