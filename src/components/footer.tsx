import { useCallback } from 'react'

import { useAppContext } from '@/context/use-app-context'
import { images, MAX_BET, multipliers } from '@/lib/constants'
import { Bet } from './bet'
import { Bullets } from './bullets'
import { Multiplier } from './multiplier'

const Footer = () => {
  const {
    countBullet,
    activeMultiplierIndex,
    hasMultiplier,
    balance,
    bet,
    setBet,
    state,
    changeState,
  } = useAppContext()

  const handleSettings = () => {
    changeState('settings')
  }

  const handleSetBet = useCallback(
    (bet: number) => {
      changeState('pull')
      setBet(bet)
    },
    [changeState, setBet],
  )

  return (
    <footer
      className='relative flex h-[74px] overflow-hidden bg-cover bg-[center_top] px-2 py-0.5'
      style={{ backgroundImage: `url(${images.bottomLine})` }}
    >
      <div className='flex w-[130px] shrink-0 justify-center'>
        <Bet
          disabled={!(state === 'bet' || hasMultiplier) || balance === 0}
          maxBet={Math.min(balance, MAX_BET)}
          bet={bet}
          onBet={handleSetBet}
        />
      </div>
      <Bullets countBullet={countBullet} />
      <div className='relative w-[130px] shrink-0'>
        <Multiplier items={multipliers} activeIndex={activeMultiplierIndex} />
        <button
          className='absolute right-0.5 bottom-0.5 h-4 w-4 cursor-pointer bg-contain bg-center'
          style={{ backgroundImage: `url(${images.settings})` }}
          onClick={handleSettings}
        ></button>
      </div>
    </footer>
  )
}

export { Footer }
