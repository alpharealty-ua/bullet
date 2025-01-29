import classNames from 'classnames'

import { Logo } from './logo'
import { PullButton } from './pull-button'
import { DealButton } from './deal-button'

const Cover = ({
  onPull,
  onGameRules,
}: {
  onPull: () => void
  onGameRules: () => void
}) => {
  const open = true

  return (
    <div
      className={classNames(
        'absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[url(/assets/images/wrapper.jpg)] bg-center px-3 py-12',
        open
          ? 'animate-in fade-in-0 visible'
          : 'animate-out fade-out-0 invisible',
      )}
    >
      <Logo size='3xl' />
      <PullButton className='w-[122px]' onClick={onPull} />
      <DealButton
        className='w-[110px] bg-[url(/assets/images/gamerules.svg)]'
        onClick={onGameRules}
      />
    </div>
  )
}

export { Cover }
