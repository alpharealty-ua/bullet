import { useCallback } from 'react'

import { useAppContext } from '@/context/use-app-context'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { images, MAX_BET, multipliers } from '@/lib/constants'
import { Bet } from './bet'
import { Bullets } from './bullets'
import { Multiplier } from './multiplier'
import { Settings } from './settings'

const Footer = () => {
  const {
    countBullet,
    activeMultiplierIndex,
    balance,
    bet,
    setBet,
    state,
    showHelpers,
    disabled,
  } = useAppContext()
  const modal = useCustomModal()
  // TODO: MOVE MAX BET TO CONTEXT
  const maxBet = Math.min(
    state === 'running' ? bet + balance : balance,
    MAX_BET,
  )

  const handleSettings = () => {
    modal.show({ contentSlot: <Settings /> })
  }

  // TODO: REMOVE WRAPPER
  const handleSetBet = useCallback(
    (bet: number) => {
      setBet(bet)
    },
    [setBet],
  )

  return (
    <footer
      className='relative flex h-[74px] bg-cover bg-[center_top] bg-no-repeat px-2 py-0.5'
      style={{ backgroundImage: `url(${images.footer})` }}
    >
      <div className='flex w-[130px] shrink-0 justify-center'>
        <Bet
          disabled={
            disabled || (state === 'running' && bet > 0) || balance === 0
          }
          maxBet={maxBet}
          bet={bet}
          onBet={handleSetBet}
          showHelpers={showHelpers && bet === 0}
        />
      </div>
      <Bullets countBullet={countBullet} />
      <div className='relative w-[130px] shrink-0'>
        <Multiplier items={multipliers} activeIndex={activeMultiplierIndex} />
        <button
          className='absolute right-0.5 bottom-0.5 h-4 w-4 cursor-pointer bg-contain bg-center bg-no-repeat'
          style={{ backgroundImage: `url(${images.settings})` }}
          onClick={handleSettings}
        ></button>
      </div>
    </footer>
  )
}

export { Footer }
