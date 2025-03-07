import { useSoloStore } from '@/store/solo.store'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { cn } from '@/lib/utils'
import { images, VariantGame } from '@/lib/constants'
import { Bet } from '@/components/bet'
import { Bullets } from '@/components/bullets'
import { Settings } from '@/components/settings'
import { Helper } from '@/components/helper'
import { Leaderboard } from '@/components/leaderboard'

const Footer = ({
  variant,
  showHelpers = false,
}: {
  variant: VariantGame
  showHelpers?: boolean
}) => {
  const setBet = useSoloStore(({ setBet }) => setBet)
  const isStartedGame = useSoloStore(({ isStartedGame }) => isStartedGame)
  const noMoney = useSoloStore(({ noMoney }) => noMoney)
  const bet = useSoloStore(({ bet }) => bet)
  const maxBet = useSoloStore(({ maxBet }) => maxBet)
  const countBullet = useSoloStore(({ countBullet }) => countBullet)
  const modal = useCustomModal()

  const handleSettingsClick = () => {
    modal.show({ contentSlot: <Settings /> })
  }

  const handleLeaderboardClick = () => {
    modal.show({ contentSlot: <Leaderboard /> })
  }

  return (
    <footer
      className={cn(
        'relative flex h-[100px] justify-between border-t-2 border-black bg-[#f2f2f2] px-2 py-1',
      )}
      style={{ backgroundImage: `url(${images.texture})` }}
    >
      <div className='relative flex w-full max-w-1/2 flex-col items-center'>
        <div className='relative flex w-full flex-col gap-2.5 text-center'>
          <div className='text-green pl-7 text-left text-2xl leading-[1] tracking-tight uppercase'>
            Wager
          </div>
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
        </div>
      </div>
      <div className='relative flex flex-col items-end justify-between'>
        <div className='flex flex-col items-center'>
          <Bullets countBullet={countBullet} />
          <div>Pulls remaining</div>
        </div>
        <div className='flex items-center gap-1'>
          <button
            onClick={handleLeaderboardClick}
            className={cn(
              'aspect-[176/186] h-10 w-10 cursor-pointer bg-contain bg-center bg-no-repeat',
            )}
            style={{
              backgroundImage: `url(${images.leaderboardstar})`,
            }}
          />
          <button
            className='h-10 w-10 cursor-pointer bg-[length:70%] bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${images.settings})` }}
            onClick={handleSettingsClick}
          ></button>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
