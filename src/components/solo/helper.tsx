import { cn } from '@/lib/utils'
import { IMAGES } from '@/lib/constants'
import { AnimationInOut } from '@/components/ui/animation-in-out'

interface HelperProps {
  image: keyof typeof IMAGES.label
  show: boolean
}

const Helper = ({ image, show }: HelperProps) => {
  return (
    <AnimationInOut
      in={show}
      unmountOnExit
      timeout={400}
      className={cn(
        'absolute bottom-full w-22.5 bg-contain bg-center bg-no-repeat',
        'slide-out-to-top-4 fade-in slide-in-from-top-4 duration-400',
        image === 'wagerhere' && 'left-4',
        image === 'startgame' && 'right-0',
      )}
    >
      <img src={IMAGES.label[image]} alt='' />
    </AnimationInOut>
  )
}

export { Helper }
