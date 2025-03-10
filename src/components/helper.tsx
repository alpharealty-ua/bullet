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
        'slide-out-to-top-4 fade-in slide-in-from-top-4 absolute bottom-full w-[90px] bg-contain bg-center bg-no-repeat duration-400',
        image === 'wagehere' && 'left-4',
        image === 'startgame' && 'right-0',
      )}
    >
      <img src={imagesMap[image]} alt='' />
    </AnimationInOut>
  )
}

export { Helper }
