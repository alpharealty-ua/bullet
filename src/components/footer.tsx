import { useBalance } from '@/api/wallet.api'
import { useSoloStore } from '@/store/solo.store'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { cn } from '@/lib/utils'
import { FormatGame, IMAGES, MULTIPLIERS, VariantGame } from '@/lib/constants'
import { Bet } from './bet'
import { Bullets } from './bullets'
import { Multiplier } from './multiplier'
import { Settings } from './settings'
import { Rank } from './rank'
import { Helper } from './helper'
import { MoneyBagButton } from './money-bag-button'
import { useDuelStore } from '@/store/duel.store'
import { Balance } from '@/components/balance'

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
  const round = useDuelStore(({ round }) => round)
  const noMoney = useSoloStore(({ noMoney }) => noMoney)
  const multiplierIndex = useSoloStore(({ multiplierIndex }) => multiplierIndex)
  const bet = useSoloStore(({ bet }) => bet)
  const maxBet = useSoloStore(({ maxBet }) => maxBet)
  const countBullet = useSoloStore(({ countBullet }) => countBullet)
  const modal = useCustomModal()
  const footerWithBg = format === 'solo' || variant === 'watch'
  const increaseTime = useSoloStore(({ increaseTime }) => increaseTime)

  const handleSettings = () => {
    modal.show({ contentSlot: <Settings /> })
  }

  return (
    <footer
      className={cn(
        'relative flex h-[74px] justify-between bg-[#f2f2f2] px-1 py-0.5',
        footerWithBg && 'bg-cover bg-[center_top] bg-no-repeat pt-1',
      )}
      style={footerWithBg ? { backgroundImage: `url(${IMAGES.footer})` } : {}}
    >
      <div className='relative flex flex-1 flex-col items-center'>
        <div className='relative flex w-full flex-col text-center'>
          <div className='text-green text-center text-2xl leading-[1] tracking-tight uppercase'>
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
          {format === 'duel' && (
            <div className='relative flex justify-center text-center text-2xl leading-[1] tracking-tight'>
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
          <div className='flex flex-1 flex-col items-center text-center'>
            <div className='text-green text-center text-2xl leading-[1] tracking-tight uppercase'>
              Round
            </div>
            <div className='text-red relative text-center text-3xl leading-[1]'>
              {round}
            </div>
          </div>
        )}
      </div>
      <div className='relative flex flex-1 flex-row justify-between'>
        {format === 'duel' && variant === 'play' && (
          <Balance value={balance} increaseTime={increaseTime} />
        )}
        {format === 'solo' && (
          <div className='flex flex-1 flex-col items-center text-center'>
            <div className='text-green text-center text-2xl leading-[1] tracking-tight uppercase'>
              Multiplier
            </div>
            {format === 'solo' && (
              <Multiplier items={MULTIPLIERS} activeIndex={multiplierIndex} />
            )}
          </div>
        )}
        {format === 'duel' && variant === 'watch' && (
          <div className='flex flex-1 flex-col items-center text-center'>
            <div className='text-green text-center text-2xl leading-[1] tracking-tight uppercase'>
              Round
            </div>
            <div className='text-red relative text-center text-3xl leading-[1]'>
              {round}
            </div>
          </div>
        )}
        <div className='absolute top-0 right-0 bottom-0 flex flex-col justify-between py-1'>
          <button
            className='mt-auto h-4 w-4 cursor-pointer bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${IMAGES.settings})` }}
            onClick={handleSettings}
          ></button>
        </div>
        {format === 'duel' && variant === 'play' && (
          <div className='shrink-0 pl-2'>
            <MoneyBagButton
              className={cn(!noMoney && 'w-4', noMoney && 'text-lg')}
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
