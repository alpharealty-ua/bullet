import { trophyDescription } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface MatchmakerStatisticsProps extends React.ComponentProps<'div'> {}

const MatchmakerTrophies = ({
  className,
  ...props
}: MatchmakerStatisticsProps) => {
  return (
    <>
      <div
        className={cn(
          'flex min-h-25 shrink-5 flex-col gap-2 overflow-hidden',
          className,
        )}
        {...props}
      >
        <div className='px-2'>Trophies</div>
        <div className='custom-scroll grid min-h-18 grid-cols-6 gap-0.5'>
          {Object.values(trophyDescription).map((values) => {
            return [values.bronze, values.silber, values.gold].map(
              (image, i) => (
                <Dialog key={i}>
                  <DialogTrigger className='cursor-pointer'>
                    <span className='block aspect-square h-18 overflow-hidden opacity-20 transition-all hover:opacity-100'>
                      <img src={image.image} alt='' />
                    </span>
                  </DialogTrigger>
                  <DialogContent className='max-w-70'>
                    <img src={image.image} alt='' />
                    <DialogHeader>
                      <DialogTitle>{values.name}</DialogTitle>
                      <DialogDescription>{image.description}</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ),
            )
          })}
        </div>
      </div>
    </>
  )
}

export { MatchmakerTrophies }
