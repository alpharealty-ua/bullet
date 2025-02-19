import { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { cn } from '@/lib/utils'
import { images } from '@/lib/constants'

const imagesMap = {
  wagehere: images.wagerhere,
  startgame: images.startgame,
}

const Helper = ({
  image,
  show,
}: {
  image: keyof typeof imagesMap
  show: boolean
}) => {
  const nodeRef = useRef(null)

  return (
    <CSSTransition nodeRef={nodeRef} in={show} unmountOnExit timeout={400}>
      {(state) => {
        const open = state === 'entering' || state === 'entered'
        const close = state === 'exiting' || state === 'exited'
        return (
          <div
            ref={nodeRef}
            key='helper'
            className={cn(
              'fill-mode-both absolute bottom-full w-[90px] bg-contain bg-center bg-no-repeat duration-400',
              open && 'animate-in fade-in slide-in-from-top-4',
              close && 'animate-out fade-out slide-out-to-top-4',
              image === 'wagehere' && 'left-4',
              image === 'startgame' && 'right-0',
            )}
          >
            <img src={imagesMap[image]} alt='' />
          </div>
        )
      }}
    </CSSTransition>
  )
}

export { Helper }
