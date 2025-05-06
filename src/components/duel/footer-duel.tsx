import { useUserStatistics } from '@/api/leaderboard.api'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Settings } from '@/components/settings'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Leaderboard } from '@/components/leaderboard/leaderboard'

const DuelFooter = ({
  round,
  hasPull = true,
  prizepool,
}: {
  round?: number
  hasPull?: boolean
  prizepool?: number
}) => {
  const { data: userStatistics } = useUserStatistics()
  const modal = useCustomModal()

  const handleSettingsClick = () => {
    modal.show({ contentSlot: <Settings /> })
  }

  const handleLeaderboardClick = () => {
    modal.show({ contentSlot: <Leaderboard /> })
  }

  return (
    <footer className='relative flex h-20 shrink-0 justify-between bg-[#f2f2f2] px-2 py-1'>
      <div className='relative flex flex-1 flex-col gap-0.5'>
        <div className='flex items-center gap-1'>
          <ButtonWithAudio
            as='button'
            image='leaderboardstar'
            onClick={handleLeaderboardClick}
            className='w-10 cursor-pointer'
          />
          <div className='flex flex-col gap-2'>
            <div className='text-base leading-[1] tracking-tight'>
              Lvl {userStatistics?.lvl ?? 0}
            </div>
          </div>
        </div>
      </div>
      <div className='relative flex flex-1 flex-col gap-0.5'>
        <div className='text-green flex items-center justify-center gap-1 text-center text-xl leading-[1] tracking-tight uppercase'>
          Round
          <div
            className='relative aspect-[1/1.5] h-5 bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${IMAGES.bullet})` }}
          >
            <div
              className={cn(
                'bg-red absolute top-1/2 left-1/2 h-0 w-0.5 origin-center -translate-1/2 rotate-45 transition-all',

                !hasPull && 'h-[130%]',
              )}
            ></div>
          </div>
        </div>
        <div className='text-red relative text-center text-2xl leading-[1]'>
          {round}
        </div>
      </div>
      <div className='relative flex flex-1 flex-col items-end gap-0.5'>
        {prizepool && (
          <div className='flex flex-col gap-0.5'>
            <div className='text-green text-center text-xl leading-[1] tracking-tight uppercase'>
              Prizepool
            </div>
            <div className='relative flex justify-center text-center text-lg leading-[1] tracking-tight'>
              ${prizepool}
            </div>
          </div>
        )}
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

export { DuelFooter }
