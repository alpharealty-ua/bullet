import { cn } from '@/lib/utils'
import { IMAGES, DUEL_COUNTDOWN } from '@/lib/constants'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Countdown } from '@/components/ui/countdown'
import { MatchmakingStatus } from '@/socket/matchmaker/matchmaker-soket.types'

const NextSearch = ({
  matchmakingStatus,
  onLeave,
  onMatchCreatedCountdownEnd,
}: {
  matchmakingStatus: MatchmakingStatus
  onLeave: () => void
  onMatchCreatedCountdownEnd: () => void
}) => {
  const isFinding =
    matchmakingStatus === 'not-in-queue' || matchmakingStatus === 'searching'

  return (
    <div className='relative mx-auto flex w-full flex-col items-center justify-center gap-2'>
      <div className='flex flex-col gap-2 px-3 py-20'>
        {isFinding && (
          <div
            className={cn(
              'absolute top-0 right-20 aspect-[1/1.5] h-10 bg-contain bg-center bg-no-repeat',
              'repeat-infinite fill-mode-both animate-[spin-with-opacity] duration-2000 ease-linear',
            )}
            style={{ backgroundImage: `url(${IMAGES.bullet})` }}
          ></div>
        )}
        <div className='px-6 text-2xl'>
          {isFinding
            ? 'Finding next opponent...'
            : matchmakingStatus === 'match-created'
              ? 'OPPONENT FOUND!'
              : ''}
        </div>
        {matchmakingStatus === 'match-created' && (
          <Countdown
            time={DUEL_COUNTDOWN}
            onEnd={onMatchCreatedCountdownEnd}
            className='my-4 flex items-center justify-center text-5xl'
          />
        )}
        {isFinding && (
          <div className='text-red flex w-full items-center justify-end gap-1'>
            Leave queue
            <ButtonWithAudio
              as='button'
              bg='red'
              className='h-5 w-5 rounded-full p-0 text-xs'
              onClick={onLeave}
            ></ButtonWithAudio>
          </div>
        )}
      </div>
    </div>
  )
}

export { NextSearch }
