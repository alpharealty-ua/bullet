import { useAppContext } from '@/context/use-app-context'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { cn } from '@/lib/utils'
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
    rank,
  } = useAppContext()
  const modal = useCustomModal()
  const footerWithBg = format === 'single' || format === 'watch'
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
      className={cn(
        'relative flex h-[74px] justify-between px-2 py-0.5',
        format === 'duel' && 'bg-[#f2f2f2]',
        footerWithBg && 'bg-cover bg-[center_top] bg-no-repeat',
      )}
      style={footerWithBg ? { backgroundImage: `url(${images.footer})` } : {}}
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
      <div
        className={cn(
          'relative flex flex-1 flex-col items-center',
          footerWithBg && 'self-end',
        )}
      >
        {(format === 'single' || format === 'watch') && (
          <div className='flex w-[114px] flex-col items-center gap-0.5 text-center'>
            <Rank value={rank} />
            <Bullets countBullet={countBullet} />
          </div>
        )}
        {format === 'duel' && (
          <div className='flex flex-col items-center text-center'>
            <div className='text-green text-xl font-bold uppercase'>Round</div>
            <div className='text-red relative text-center text-3xl leading-[1]'>
              3
            </div>
          </div>
        )}
        <div className='flex flex-col items-center text-center'></div>
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
        {/* TODO: ADD BALANCE  */}
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
