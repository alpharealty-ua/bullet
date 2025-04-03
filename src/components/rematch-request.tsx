import { Indicator, Indicators } from './indicators'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

interface RematchRequestProps {
  indicators: Indicator[]
  onRequest: () => void
  onCancel: () => void
}

const RematchRequest = ({
  indicators,
  onRequest,
  onCancel,
}: RematchRequestProps) => {
  return (
    <div className='absolute top-1/2 left-1/2 z-3 flex w-full max-w-80 -translate-1/2 flex-col items-center justify-center gap-4 bg-white/90 p-4 text-center shadow-2xl'>
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
    </div>
  )
}

export { RematchRequest }
