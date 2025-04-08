import { IoPlay } from 'react-icons/io5'

import { MatchmakingStatus } from '@/socket/matchmaker/matchmaker-soket.types'
import { START_GAME_COUNTDOWN, IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Countdown } from '@/components/countdown'
import { Indicator, Indicators } from '@/components/indicators'

interface EnterArenaProps {
  onDecline: () => void
  onConfirm: () => void
  onSearch: (amount: number) => void
  onCountdownEnd: () => void
  indicators: Indicator[]
  matchmakingStatus: MatchmakingStatus
  confirmationTimeoutSeconds: number
  defaultValue: string
}

const matchmakingStatusMap: Record<MatchmakingStatus, string> = {
  'not-in-queue': 'Not in queue',
  connecting: 'Connecting to matchmaking',
  searching: 'Searching for opponents',
  'match-found': 'Match found! Waiting for confirmation',
  'match-created': 'Match created! Game starting',
} as const

const EnterArena = ({
  onDecline,
  onConfirm,
  onSearch,
  onCountdownEnd,
  indicators,
  confirmationTimeoutSeconds,
  matchmakingStatus,
  defaultValue,
}: EnterArenaProps) => {
  const isSearching = matchmakingStatus === 'searching'
  const isFound = matchmakingStatus === 'match-found'
  const isMatchCreated = matchmakingStatus === 'match-created'

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    const input = form.querySelector('[data-value]') as HTMLInputElement

    if (input === null) {
      return
    }

    const value = input.value

    if (value === '') {
      return
    }

    onSearch(Number(value))
  }

  return (
    <div className='relative mx-auto flex w-full flex-col items-center justify-center gap-2'>
      <form onSubmit={handleSubmit} className='flex max-w-46 flex-col gap-2'>
        <button className='hover:text-green cursor-pointer text-2xl transition-all'>
          Enter arena
        </button>
        <div
          className={cn(
            'relative flex aspect-[1/0.312] w-full items-center justify-between gap-2 bg-contain bg-center bg-no-repeat px-2.5 pl-5 text-2xl',
            'repeat-infinite direction-alternate duration-500 ease-linear',
            isSearching && 'animate-[pulse-enter-arena]',
          )}
          style={{ backgroundImage: `url(${IMAGES.enterarena})` }}
        >
          <div className='flex grow items-center gap-1'>
            <div className={cn('shrink-0', isSearching && 'opacity-75')}>$</div>
            <input
              className='h-10 w-full bg-transparent outline-none disabled:opacity-75'
              defaultValue={defaultValue}
              type='number'
              disabled
              autoFocus
              data-value
            />
          </div>
          <button
            className={cn(
              'relative -top-0.5 flex h-13 w-7 shrink-0 cursor-pointer items-center justify-center font-bold opacity-100 transition-colors disabled:cursor-not-allowed [&:hover_span]:scale-110',
              (isSearching || isFound) &&
                'text-red hover:bg-red/10 active:bg-red/20 text-xl select-none',
              !(isSearching || isFound) &&
                'text-green hover:bg-green/10 active:bg-green/20 text-2xl select-none',
            )}
            disabled={isFound || isMatchCreated}
          >
            <span className='transition-transform'>
              {isSearching || isFound ? 'X' : <IoPlay />}
            </span>
          </button>
        </div>
      </form>
      <div className='animate-in fade-in max-w-80 px-3 duration-500'>
        <div className='text-lg'>
          {matchmakingStatusMap[matchmakingStatus]}{' '}
          {(isSearching || isFound || isMatchCreated) && (
            <>
              <span className='repeat-infinite direction-alternate inline-block animate-[pulse-period] rounded-full align-bottom delay-0 duration-400 ease-linear'>
                .
              </span>
              <span className='repeat-infinite direction-alternate inline-block animate-[pulse-period] rounded-full align-bottom delay-200 duration-400 ease-linear'>
                .
              </span>
              <span className='repeat-infinite direction-alternate inline-block animate-[pulse-period] rounded-full align-bottom delay-400 duration-400 ease-linear'>
                .
              </span>
            </>
          )}
        </div>
        {isFound && (
          <div className='animate-in fade-in flex max-w-80 flex-col gap-1 text-center duration-500'>
            <div className='text-xs'>
              A match has been found. Please confirm to join the&nbsp;game.
            </div>
            <Indicators indicators={indicators} />
            <Countdown time={confirmationTimeoutSeconds} />
            <div className='flex justify-between gap-4'>
              <ButtonWithAudio
                as='button'
                bg='green'
                className='w-full text-sm'
                onClick={onConfirm}
              >
                Confirm
              </ButtonWithAudio>
              <ButtonWithAudio
                as='button'
                bg='red'
                className='w-full text-sm'
                onClick={onDecline}
              >
                Decline
              </ButtonWithAudio>
            </div>
          </div>
        )}
        {isMatchCreated && (
          <Countdown
            time={START_GAME_COUNTDOWN}
            onEnd={onCountdownEnd}
            className='my-4 flex items-center justify-center text-5xl'
          />
        )}
      </div>
    </div>
  )
}

export { EnterArena }
