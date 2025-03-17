import { useBalance } from '@/api/wallet.api'
import { useGameStore } from '@/store/game.store'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { cn } from '@/lib/utils'
import { FormatGame, IMAGES, VariantGame } from '@/lib/constants'
import { Bullets } from '@/components/bullets'
import { Settings } from '@/components/settings'
import { Rank } from '@/components/rank'
import { MoneyBagButton } from '@/components/money-bag-button'
import { Balance } from '@/components/balance'

const Footer = ({
  // format,
  variant,
}: {
  format: FormatGame
  variant: VariantGame
  showHelpers?: boolean
}) => {
  const { data: balance } = useBalance()

  const round = useGameStore(({ round }) => round)
  const noMoney = useGameStore(({ noMoney }) => noMoney)
  const countBullet = useGameStore(({ countBullet }) => countBullet)
  const modal = useCustomModal()
  const footerWithBg = variant === 'watch'
  const increaseTime = useGameStore(({ increaseTime }) => increaseTime)

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
          <div className='text-green text-center text-xl leading-[1] tracking-tight uppercase'>
            {variant === 'play' ? 'Prizepool' : 'Jackpot'}
          </div>
          <div className='relative flex justify-center text-center text-2xl leading-[1] tracking-tight'>
            $2000
          </div>
        </div>
      </div>
      <div
        className={cn(
          'relative flex flex-1 flex-col items-center',
          footerWithBg && 'self-end',
        )}
      >
        {variant === 'watch' && (
          <div className='flex w-[114px] flex-col items-center gap-0.5 text-center'>
            <Rank value={30} />
            <Bullets countBullet={countBullet} />
          </div>
        )}
        {variant === 'play' && (
          <div className='flex flex-1 flex-col items-center text-center'>
            <div className='text-green text-center text-2xl leading-[1] tracking-tight uppercase'>
              <span className='relative -left-0.5'>Round</span>
            </div>
            <div className='text-red relative text-center text-2xl leading-[1]'>
              {round}
            </div>
          </div>
        )}
      </div>
      <div className='relative flex flex-1 flex-row justify-between'>
        {variant === 'play' && (
          <div className='relative flex flex-col items-end self-start'>
            <div className='text-green text-center text-xl leading-[1] tracking-tight uppercase'>
              Balance
            </div>
            <Balance value={balance} increaseTime={increaseTime} />
          </div>
        )}
        {variant === 'watch' && (
          <div className='flex flex-1 flex-col items-center text-center'>
            <div className='text-green text-center text-xl leading-[1] tracking-tight uppercase'>
              Round
            </div>
            <div className='text-red relative text-center text-3xl leading-[1]'>
              {round}
            </div>
          </div>
        )}
        {variant === 'play' && (
          <div className='shrink-0 pl-1'>
            <MoneyBagButton
              as='button'
              className={cn(!noMoney && 'w-6', noMoney && 'text-lg')}
              balance={balance}
              noMoney={noMoney}
              bg=''
            />
          </div>
        )}
        <div className='absolute right-0 bottom-0 flex flex-col justify-between py-1'>
          <button
            className='mt-auto h-6 w-6 cursor-pointer bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${IMAGES.settings})` }}
            onClick={handleSettings}
          ></button>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
