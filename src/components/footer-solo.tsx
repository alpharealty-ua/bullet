import { useGameStore } from '@/store/game.store'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { IMAGES } from '@/lib/constants'
import { Bet } from '@/components/bet'
import { Bullets } from '@/components/bullets'
import { Settings } from '@/components/settings'
import { Leaderboard } from '@/components/leaderboard'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const Footer = ({ disabledBet }: { disabledBet: boolean }) => {
  const setBet = useGameStore(({ setBet }) => setBet)
  const bet = useGameStore(({ bet }) => bet)
  const maxBet = useGameStore(({ maxBet }) => maxBet)
  const countBullet = useGameStore(({ countBullet }) => countBullet)
  const modal = useCustomModal()

  const handleSettingsClick = () => {
    modal.show({ contentSlot: <Settings /> })
  }

  const handleLeaderboardClick = () => {
    modal.show({ contentSlot: <Leaderboard /> })
  }

  return (
    <footer
      className='relative flex h-[100px] justify-between border-t-2 border-black bg-[#f2f2f2] px-2 py-1'
      style={{ backgroundImage: `url(${IMAGES.texture})` }}
    >
      <div className='relative flex w-full max-w-1/2 flex-col items-center'>
        <div className='relative flex w-full flex-col gap-2.5 text-center'>
          <div className='text-green pl-7 text-left text-2xl leading-[1] tracking-tight uppercase'>
            Wager
          </div>
          <Bet
            disabled={disabledBet}
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
          <ButtonWithAudio
            as='button'
            image='leaderboardstar'
            onClick={handleLeaderboardClick}
            className='w-10 cursor-pointer'
          />
          <ButtonWithAudio
            as='button'
            image='settings'
            className='w-10 cursor-pointer bg-center bg-no-repeat p-1.5'
            onClick={handleSettingsClick}
          />
        </div>
      </div>
    </footer>
  )
}

export { Footer }
