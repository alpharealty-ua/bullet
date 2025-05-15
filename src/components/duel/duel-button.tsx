import { ButtonWithAudio } from '../ui/button-with-audio'
import { useDuelStore } from '@/store/duel.store'

interface DuelPullButtonProps {
  onPull: () => void
}

const DuelPullButton = ({ onPull }: DuelPullButtonProps) => {
  const round = useDuelStore(({ round }) => round)
  const canPull = useDuelStore(({ canPull }) => canPull)
  const pulls = useDuelStore(({ pulls }) => pulls)
  const hasPull = !pulls.includes(round)

  return (
    <ButtonWithAudio
      as='button'
      className='w-26'
      image='pull'
      onClick={onPull}
      disabled={!hasPull || !canPull}
      skipWaitAnimation
    />
  )
}

export { DuelPullButton }
