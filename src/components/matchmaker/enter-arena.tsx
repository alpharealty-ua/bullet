import { IoPlay } from 'react-icons/io5'

import { MatchmakingStatus } from '@/socket/matchmaker/matchmaker-soket.types'
import { useMatchmakerStore } from '@/store/matchmaker.store'
import { DUEL_COUNTDOWN, IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Countdown } from '@/components/ui/countdown'
import { Indicators } from '@/components/ui/indicators'
import { Actions } from '@/components/ui/actions'

interface EnterArenaProps extends React.ComponentProps<'div'> {
  onDecline: () => void
  onConfirm: () => void
  onSearch: (amount: number) => void
  onMatchCreatedCountdownEnd: () => void
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
  onMatchCreatedCountdownEnd,
  defaultValue,
  className,
  ...props
}: EnterArenaProps) => {
  const matchmakingStatus = useMatchmakerStore(
    ({ matchmakingStatus }) => matchmakingStatus,
  )
  const confirmationTimeoutSeconds = useMatchmakerStore(
    ({ confirmationTimeoutSeconds }) => confirmationTimeoutSeconds,
  )
  const indicators = useMatchmakerStore(({ indicators }) => indicators)

  const isNotInQueue = matchmakingStatus === 'not-in-queue'
  const isSearching = matchmakingStatus === 'searching'
  const isFound = matchmakingStatus === 'match-found'
  const isMatchCreated = matchmakingStatus === 'match-created'

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    const input = form.querySelector('[data-value]') as HTMLInputElement

    if (input === null || input.value === '') {
      return
    }

    onSearch(Number(input.value))
  }

  return (
    <div
      className={cn(
        'flex shrink-0 flex-col items-center justify-center',
        className,
      )}
      {...props}
    >
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
              !isNotInQueue &&
                'text-red hover:bg-red/10 active:bg-red/20 text-xl select-none',
              isNotInQueue &&
                'text-green hover:bg-green/10 active:bg-green/20 text-2xl select-none',
            )}
            disabled={isFound || isMatchCreated}
          >
            <span className='transition-transform'>
              {isNotInQueue ? <IoPlay /> : 'X'}
            </span>
          </button>
        </div>
      </form>
      <div className='animate-in fade-in max-w-100 px-3 duration-500'>
        <div className='flex min-h-10 items-center gap-4'>
          <div className='text-lg'>
            {matchmakingStatusMap[matchmakingStatus]}
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
          {isMatchCreated && (
            <Countdown
              time={DUEL_COUNTDOWN}
              onEnd={onMatchCreatedCountdownEnd}
              className='inline-flex text-3xl'
            />
          )}
        </div>
        {isFound && (
          <div className='animate-in fade-in mx-auto flex max-w-80 flex-col gap-1 text-center duration-500'>
            <div className='mx-auto flex w-full'>
              <div className='flex items-center gap-2 border-2 border-r-0 bg-white p-2'>
                <div className='text-left text-[10px]'>
                  A match has been found. Please confirm to join the&nbsp;game.
                </div>
                <Actions onConfirm={onConfirm} onCancel={onDecline} />
                <Countdown
                  time={confirmationTimeoutSeconds}
                  className='min-w-6'
                  mute
                  endMute
                />
              </div>
              <Indicators
                indicators={indicators.map((i) => i.action)}
                className='min-w-10'
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { EnterArena }
