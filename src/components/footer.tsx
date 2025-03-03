import { useBalance } from '@/api/wallet.api'
import { useSoloStore } from '@/store/solo.store'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { cn } from '@/lib/utils'
import { FormatGame, images, MULTIPLIERS, VariantGame } from '@/lib/constants'
import { Bet } from './bet'
import { Bullets } from './bullets'
import { Multiplier } from './multiplier'
import { Settings } from './settings'
import { Rank } from './rank'
import { Helper } from './helper'
import { MoneyBagButton } from './money-bag-button'

const Footer = ({
  format,
  variant,
  showHelpers = false,
}: {
  format: FormatGame
  variant: VariantGame
  showHelpers?: boolean
}) => {
  const { data: balance } = useBalance()

  const setBet = useSoloStore(({ setBet }) => setBet)
  const isStartedGame = useSoloStore(({ isStartedGame }) => isStartedGame)
  const noMoney = useSoloStore(({ noMoney }) => noMoney)
  const multiplierIndex = useSoloStore(({ multiplierIndex }) => multiplierIndex)
  const bet = useSoloStore(({ bet }) => bet)
  const maxBet = useSoloStore(({ maxBet }) => maxBet)
  const countBullet = useSoloStore(({ countBullet }) => countBullet)
  const modal = useCustomModal()
  const footerWithBg = format === 'solo' || variant === 'watch'

  const handleSettings = () => {
    modal.show({ contentSlot: <Settings /> })
  }

  return (
    <footer
      className={cn(
        'relative flex h-[74px] justify-between bg-[#f2f2f2] px-1 py-0.5',
        footerWithBg && 'bg-cover bg-[center_top] bg-no-repeat',
      )}
      style={footerWithBg ? { backgroundImage: `url(${images.footer})` } : {}}
    >
      <div className='relative flex flex-1 flex-col items-center'>
        <div className='relative flex w-full flex-col text-center'>
          <div className='text-green text-xl font-bold uppercase'>
            {format === 'solo' || variant === 'play'
              ? { solo: 'Bet', duel: 'Prizepool' }[format]
              : 'Jackpot'}
          </div>
          {format === 'solo' && (
            <>
              <Helper
                image='wagehere'
                show={showHelpers && bet === 0 && !isStartedGame}
              />
              <Bet
                disabled={isStartedGame || noMoney}
                maxBet={maxBet}
                bet={bet}
                onBet={setBet}
                size='sm'
              />
            </>
          )}
          {format === 'duel' && variant === 'play' && (
            <div className='relative text-center text-3xl leading-[1]'>
              $2000
            </div>
          )}
          {format === 'duel' && variant === 'watch' && (
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
        {(format === 'solo' || variant === 'watch') && (
          <div className='flex w-[114px] flex-col items-center gap-0.5 text-center'>
            <Rank value={30} />
            <Bullets countBullet={countBullet} />
          </div>
        )}
        {format === 'duel' && variant === 'play' && (
          <div className='flex flex-col items-center text-center'>
            <div className='text-green text-xl font-bold uppercase'>Round</div>
            <div className='text-red relative text-center text-3xl leading-[1]'>
              3
            </div>
          </div>
        )}
        <div className='flex flex-col items-center text-center'></div>
      </div>
      <div className='relative flex flex-1 flex-row justify-center'>
        <div className='flex flex-col items-center text-center'>
          <div className='text-green text-xl font-bold uppercase'>
            {format === 'solo' || variant === 'play'
              ? { solo: 'Multiplier', duel: 'Balance' }[format]
              : 'Round'}
          </div>
          {format === 'solo' && (
            <Multiplier items={MULTIPLIERS} activeIndex={multiplierIndex} />
          )}
          {format === 'duel' && variant === 'play' && (
            <div className='relative text-center text-3xl leading-[1]'>
              $2000
            </div>
          )}
          {format === 'duel' && variant === 'watch' && (
            <div className='text-red relative text-center text-3xl leading-[1]'>
              3
            </div>
          )}
        </div>
        <div className='absolute top-0 right-0 bottom-0 flex flex-col justify-between py-1'>
          <button
            className='mt-auto h-4 w-4 cursor-pointer bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${images.settings})` }}
            onClick={handleSettings}
          ></button>
        </div>
        {format === 'duel' && variant === 'play' && (
          <div className='py-1 pl-2'>
            <MoneyBagButton
              className='w-4'
              balance={balance}
              noMoney={noMoney}
            />
          </div>
        )}
      </div>
    </footer>
  )
}

export { Footer }
