import { useAppContext } from '@/context/use-app-context'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { images, MAX_BET, multipliers } from '@/lib/constants'
import { Bet } from './bet'
import { Bullets } from './bullets'
import { Multiplier } from './multiplier'
import { Settings } from './settings'
import { Rank } from './rank'
import { Round } from './round'
import { Jackpot } from './jackpot'

const Footer = () => {
  const {
    format,
    countBullet,
    activeMultiplierIndex,
    balance,
    bet,
    setBet,
    state,
    showHelpers,
    disabled,
    rank,
  } = useAppContext()
  const modal = useCustomModal()
  // TODO: MOVE MAX BET TO CONTEXT
  const maxBet = Math.min(
    state === 'running' ? bet + balance : balance,
    MAX_BET,
  )
  const betDisabled =
    disabled || (state === 'running' && bet > 0) || balance === 0

  const handleSettings = () => {
    modal.show({ contentSlot: <Settings /> })
  }

  return (
    <footer
      className='relative flex h-[74px] bg-cover bg-[center_top] bg-no-repeat px-2 py-0.5'
      style={{ backgroundImage: `url(${images.footer})` }}
    >
      <div className='flex w-[130px] shrink-0 flex-col justify-center'>
        {format === 'single' ? (
          <Bet
            disabled={betDisabled}
            maxBet={maxBet}
            bet={bet}
            onBet={setBet}
            showHelpers={showHelpers && bet === 0}
          />
        ) : (
          <Jackpot value={2000} />
        )}
      </div>
      <div className='mr-auto ml-auto flex w-[114px] flex-col self-end'>
        <Rank value={rank} />
        <Bullets countBullet={countBullet} />
      </div>
      <div className='relative flex w-[130px] shrink-0 flex-col'>
        {format === 'single' ? (
          <Multiplier items={multipliers} activeIndex={activeMultiplierIndex} />
        ) : (
          <Round value={3} />
        )}

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
