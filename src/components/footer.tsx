import { useUser } from '@/api/auth.api'
import { useGameStore } from '@/store/game.store'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { Settings } from '@/components/settings'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Leaderboard } from '@/components/leaderboard'
import { ProfileLink } from '@/components/profile-link'

const Footer = () => {
  const round = useGameStore(({ round }) => round)
  const modal = useCustomModal()
  // TODO: CHANGED TO USE PROFILE OR RENAME HEADER TO HEADER_AUTH
  const user = useUser()

  const handleSettingsClick = () => {
    modal.show({ contentSlot: <Settings /> })
  }

  const handleLeaderboardClick = () => {
    modal.show({ contentSlot: <Leaderboard /> })
  }

  return (
    <footer className='relative flex h-[74px] justify-between bg-[#f2f2f2] px-2 py-1'>
      <div className='relative flex flex-1 flex-col gap-0.5'>
        <div className='flex items-center gap-1'>
          <ButtonWithAudio
            as='button'
            image='leaderboardstar'
            onClick={handleLeaderboardClick}
            className='w-10 cursor-pointer'
          />
          <div className='flex flex-col gap-1'>
            <div className='text-base leading-[1] tracking-tight'>Lvl 921</div>
            <ProfileLink className='self-start' user={user} />
          </div>
        </div>
      </div>
      <div className='relative flex flex-1 flex-col gap-0.5'>
        <div className='text-green text-center text-xl leading-[1] tracking-tight uppercase'>
          Round
        </div>
        <div className='text-red relative text-center text-2xl leading-[1]'>
          {round}
        </div>
      </div>
      <div className='relative flex flex-1 flex-col items-end gap-0.5'>
        <div className='flex flex-col gap-0.5'>
          <div className='text-green text-center text-xl leading-[1] tracking-tight uppercase'>
            Prizepool
          </div>
          <div className='relative flex justify-center text-center text-lg leading-[1] tracking-tight'>
            $2000
          </div>
        </div>
      </div>
      <div className='absolute right-1 bottom-1'>
        <ButtonWithAudio
          as='button'
          image='settings'
          className='w-5 cursor-pointer bg-center bg-no-repeat p-1'
          onClick={handleSettingsClick}
        />
      </div>
    </footer>
  )
}

export { Footer }
