import { useImperativeHandle } from 'react'
import { RxCheck, RxCross1 } from 'react-icons/rx'

import { UpdateShowMethods, useUpdateShow } from '@/hooks/use-update-show'
import { cn } from '@/lib/utils'
import { AnimationInOut } from '@/components/ui/animation-in-out'
import { Indicator, Indicators } from '@/components/ui/indicators'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Countdown } from '@/components/ui/countdown'

export interface RematchRequestHandle
  extends UpdateShowMethods<RematchRequestState> {
  action: (userOrOpponnent: IndicatorSide, action: Indicator) => Promise<void>
}

type IndicatorSide = 'user' | 'opponnent'

interface RematchRequestState {
  show: boolean
  indicators: Record<IndicatorSide, Indicator>
}

interface RematchRequestProps {
  rematchRequestHandleRef?: React.ForwardedRef<RematchRequestHandle>
  onRequest: () => void
  onCancel: () => void
  onCountdownEnd: () => void
}

const RematchRequest = ({
  rematchRequestHandleRef,
  onRequest,
  onCancel,
  onCountdownEnd: onCountdoenEnd,
}: RematchRequestProps) => {
  const {
    state: { show, indicators },
    timeout,
    ...methods
  } = useUpdateShow<RematchRequestState>({
    show: false,
    indicators: {
      user: 'init',
      opponnent: 'init',
    },
  })

  const action = async (userOrOpponnent: IndicatorSide, action: Indicator) => {
    methods.updateState((p) => ({
      ...p,
      indicators: {
        ...p.indicators,
        [userOrOpponnent]: action,
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
        'absolute bottom-10 left-0 flex',
        'slide-in-from-bottom slide-out-to-bottom duration-400',
      )}
    >
      <div className='2xs:border-t-3 flex items-center gap-2 border-t-2 border-black bg-white p-2'>
        <div className='text-2xl'>Rematch?</div>

        <div className='flex justify-between gap-1'>
          <ButtonWithAudio
            as='button'
            bg='white'
            className='text-green h-4 w-4 rounded-full p-0 pb-0.5 text-xl'
            onClick={onRequest}
          >
            <RxCheck />
          </ButtonWithAudio>
          <ButtonWithAudio
            as='button'
            bg='white'
            className='text-red h-4 w-4 rounded-full p-0 text-sm'
            onClick={onCancel}
          >
            <RxCross1 />
          </ButtonWithAudio>
        </div>
        <Countdown
          time={7}
          onEnd={onCountdoenEnd}
          className='w-5 items-center justify-center text-center'
          playSound
        />
      </div>
      <Indicators
        className='w-11 border-b-0'
        indicators={[indicators.user, indicators.opponnent]}
      />
    </AnimationInOut>
  )
}

export { RematchRequest }
