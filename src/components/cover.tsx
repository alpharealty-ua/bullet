import { images } from '@/lib/constants'
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
  return (
    <>
      <Logo size='3xl' />
      <PullButton className='w-[122px]' onClick={onPull} />
      <DealButton
        className='w-[110px]'
        style={{ backgroundImage: `url(${images.gamerules})` }}
        onClick={onGameRules}
      />
    </>
  )
}

export { Cover }
