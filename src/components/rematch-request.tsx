import { useImperativeHandle } from 'react'

import { UpdateShowMethods, useUpdateShow } from '@/hooks/use-update-show'
import { cn } from '@/lib/utils'
import { AnimationInOut } from '@/components/animation-in-out'
import { Indicator, Indicators } from '@/components/indicators'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

export interface RematchRequestHandle
  extends UpdateShowMethods<RematchRequestState> {
  action: (playerOrOpponnent: IndicatorSide, action: Indicator) => Promise<void>
}

type IndicatorSide = 'player' | 'opponnent'

interface RematchRequestState {
  show: boolean
  indicators: Record<IndicatorSide, Indicator>
}

interface RematchRequestProps {
  rematchRequestHandleRef?: React.ForwardedRef<RematchRequestHandle>
  onRequest: () => void
  onCancel: () => void
}

const RematchRequest = ({
  rematchRequestHandleRef,
  onRequest,
  onCancel,
}: RematchRequestProps) => {
  const {
    state: { show, indicators },
    timeout,
    ...methods
  } = useUpdateShow<RematchRequestState>({
    show: false,
    indicators: {
      player: 'init',
      opponnent: 'init',
    },
  })

  const action = async (
    playerOrOpponnent: IndicatorSide,
    action: Indicator,
  ) => {
    methods.updateState((p) => ({
      ...p,
      indicators: {
        ...p.indicators,
        [playerOrOpponnent]: action,
      },
    }))
  }

  useImperativeHandle(rematchRequestHandleRef, () => ({
    ...methods,
    action,
  }))

  return (
    <AnimationInOut
      in={show}
      unmountOnExit
      timeout={timeout}
      className={cn(
        'absolute top-1/2 left-1/2 z-3 flex w-full max-w-80 -translate-1/2 flex-col items-center justify-center gap-4 bg-white/90 p-4 text-center shadow-2xl',
        'zoom-in-0 zoom-out-0 duration-400',
      )}
    >
      <div className='text-2xl'>Request rematch</div>
      <Indicators indicators={indicators} />
      <div className='flex justify-between gap-4'>
        <ButtonWithAudio
          as='button'
          bg='green'
          className='w-full text-sm'
          onClick={onRequest}
        >
          Request
        </ButtonWithAudio>
        <ButtonWithAudio
          as='button'
          bg='red'
          className='w-full text-sm'
          onClick={onCancel}
        >
          Cancel
        </ButtonWithAudio>
      </div>
    </AnimationInOut>
  )
}

export { RematchRequest }
