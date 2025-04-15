import { cn } from '@/lib/utils'
import { IMAGES } from '@/lib/constants'
import { AnimationInOut } from '@/components/animation-in-out'

const imagesMap = {
  wagehere: IMAGES.wagerhere,
  startgame: IMAGES.startgame,
}

const Helper = ({
  image,
  show,
}: {
  image: keyof typeof imagesMap
  show: boolean
}) => {
  return (
    <AnimationInOut
      in={show}
      unmountOnExit
      timeout={400}
      className={cn(
        'absolute bottom-full w-22.5 bg-contain bg-center bg-no-repeat',
        'slide-out-to-top-4 fade-in slide-in-from-top-4 duration-400',
        image === 'wagehere' && 'left-4',
        image === 'startgame' && 'right-0',
      )}
    >
      <img src={imagesMap[image]} alt='' />
    </AnimationInOut>
  )
}

export { Helper }
