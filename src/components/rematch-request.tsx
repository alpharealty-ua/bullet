import { useImperativeHandle, useState } from 'react'

import { cn } from '@/lib/utils'
import { AnimationInOut } from '@/components/animation-in-out'
import { Indicator, Indicators } from '@/components/indicators'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

export interface RematchRequestHandle {
  updateState: (state: Partial<RematchRequestState>) => Promise<void>
}

interface RematchRequestState {
  show: boolean
}

interface RematchRequestProps {
  rematchRequestHandleRef?: React.ForwardedRef<RematchRequestHandle>
  indicators: Indicator[]
  onRequest: () => void
  onCancel: () => void
}

const RematchRequest = ({
  rematchRequestHandleRef,
  indicators,
  onRequest,
  onCancel,
}: RematchRequestProps) => {
  const [{ show }, setState] = useState<RematchRequestState>({
    show: false,
  })

  const updateState = async (state: Partial<RematchRequestState>) =>
    setState((p) => ({ ...p, ...state }))

  useImperativeHandle(rematchRequestHandleRef, () => ({
    updateState,
  }))

  return (
    <AnimationInOut
      in={show}
      unmountOnExit
      timeout={400}
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
