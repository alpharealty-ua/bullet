import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { PullButton } from './pull-button'
import { DealButton } from './deal-button'
import { Logo } from './logo'

const Cover = ({
  onPull,
  onGameRules,
}: {
  onPull: () => void
  onGameRules: () => void
}) => {
  // TODO: REMOVE
  const open = true

  return (
    <div
      className={cn(
        'absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 px-3 py-12',
        open
          ? 'animate-in fade-in-0 visible'
          : 'animate-out fade-out-0 invisible',
      )}
    >
      <Logo size='3xl' />
      <PullButton className='w-[122px]' onClick={onPull} />
      <DealButton
        className='w-[110px]'
        style={{ backgroundImage: `url(${images.gamerules})` }}
        onClick={onGameRules}
      />
    </div>
  )
}

export { Cover }
