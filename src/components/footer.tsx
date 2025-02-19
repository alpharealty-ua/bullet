import { useAppContext } from '@/context/use-app-context'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { images, MAX_BET, multipliers } from '@/lib/constants'
import { Bet } from './bet'
import { Bullets } from './bullets'
import { Multiplier } from './multiplier'
import { Settings } from './settings'
import { Rank } from './rank'
import { Helper } from './helper'

const Footer = ({ format }: { format: 'single' | 'duel' | 'watch' }) => {
  const {
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
      className='relative flex h-[74px] justify-between bg-cover bg-[center_top] bg-no-repeat px-2 py-0.5'
      style={{ backgroundImage: `url(${images.footer})` }}
    >
      <div className='relative flex flex-1 flex-col items-center'>
        <div className='relative flex w-full flex-col text-center'>
          <div className='text-green text-xl font-bold uppercase'>
            {{ single: 'Bet', duel: 'Prizepool', watch: 'Jackpot' }[format]}
          </div>
          {format === 'single' && (
            <>
              <Helper image='wagehere' show={showHelpers && bet === 0} />
              <Bet
                disabled={betDisabled}
                maxBet={maxBet}
                bet={bet}
                onBet={setBet}
                valueInBottom
                size='sm'
              />
            </>
          )}
          {format === 'duel' && (
            <div className='relative text-center text-3xl leading-[1]'>
              $2000
            </div>
          )}
          {format === 'watch' && (
            <div className='relative text-center text-3xl leading-[1]'>
              $2000
            </div>
          )}
        </div>
      </div>
      <div className='relative flex flex-1 flex-col items-center self-end'>
        <div className='flex w-[114px] flex-col gap-0.5'>
          <Rank value={rank} />
          <Bullets countBullet={countBullet} />
        </div>
      </div>
      <div className='relative flex flex-1 flex-col items-center'>
        <div className='flex flex-col items-center text-center'>
          <div className='text-green text-xl font-bold uppercase'>
            {{ single: 'Multiplier', duel: 'Balance', watch: 'Round' }[format]}
          </div>
          {format === 'single' && (
            <Multiplier
              items={multipliers}
              activeIndex={activeMultiplierIndex}
            />
          )}
          {format === 'duel' && (
            <div className='relative text-center text-3xl leading-[1]'>
              $2000
            </div>
          )}
          {format === 'watch' && (
            <div className='text-red relative text-center text-3xl leading-[1]'>
              3
            </div>
          )}
        </div>
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
