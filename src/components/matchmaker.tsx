import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { useBalance } from '@/api/wallet.api'
import { useMatchmakingSocket } from '@/socket/matchmaker/use-matchmaking-socket'
import { MatchmakerSocketEvents } from '@/socket/matchmaker/matchmaker-socket'
import { useShowAddMoneyModal } from '@/hooks/use-add-money-modal'
import { useWait } from '@/hooks/use-wait'
import { ROUTES } from '@/routes/path'
import { cn } from '@/lib/utils'
import { IMAGES, MIN_DUEL_BET, START_GAME_COUNTDOWN } from '@/lib/constants'
import { EnterArena } from '@/components/enter-arena'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { MatchmakerStatistics } from '@/components/matchmaker-statistics'
import { Countdown } from '@/components/countdown'

const Matchmaker = ({
  matchmakerEvents,
  autoJoin,
  isNextSearch,
}: {
  matchmakerEvents: MatchmakerSocketEvents
  autoJoin?: boolean
  isNextSearch?: boolean
}) => {
  const navigate = useNavigate()
  const { data: balance } = useBalance()
  const showAddMoneyModal = useShowAddMoneyModal()
  const canJoin = !(balance < MIN_DUEL_BET)

  const {
    joinMatchmaking,
    leaveMatchmaking,
    declineMatch,
    confirmMatch,
    statistics,
    matchmakingStatus,
    indicators,
    confirmationTimeoutSeconds,
    gameId,
  } = useMatchmakingSocket(matchmakerEvents)

  const handleSearch = () => {
    matchmakingStatus === 'not-in-queue'
      ? joinMatchmaking()
      : matchmakingStatus === 'searching' && leaveMatchmaking()
  }

  const handleMatchCreatedCountdownEnd = useCallback(async () => {
    if (!gameId) {
      return
    }

    navigate(`${ROUTES.duel.root}/${gameId}`, {
      preventScrollReset: true,
    })
  }, [navigate, gameId])

  const handleAddMoney = showAddMoneyModal

  const handleLeave = () => {
    leaveMatchmaking()
    navigate(ROUTES.duel.play)
  }

  const wait = useWait()
  useEffect(() => {
    if (!autoJoin) {
      return
    }

    let called = false
    ;(async () => {
      await wait(3000)
      called = true
      joinMatchmaking()
    })()

    return () => {
      if (!called) {
        return
      }

      leaveMatchmaking()
    }
  }, [autoJoin, joinMatchmaking, leaveMatchmaking, wait])

  const isFinding =
    matchmakingStatus === 'not-in-queue' || matchmakingStatus === 'searching'

  return (
    <div className='my-auto w-full'>
      {!canJoin && (
        <div className='relative flex flex-col items-center justify-center pt-6'>
          {/*  TODO: EXTRACTED TO COMPONENT  */}
          <ButtonWithAudio
            as='button'
            image='button'
            text='Add money'
            onClick={handleAddMoney}
          />
        </div>
      )}
      {canJoin && (
        <div className='flex w-full flex-col items-center justify-center gap-3'>
          {isNextSearch && (
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
                    time={START_GAME_COUNTDOWN}
                    onEnd={handleMatchCreatedCountdownEnd}
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
                      onClick={handleLeave}
                    ></ButtonWithAudio>
                  </div>
                )}
              </div>
            </div>
          )}
          {!isNextSearch && (
            <EnterArena
              onDecline={declineMatch}
              onConfirm={confirmMatch}
              onSearch={handleSearch}
              onMatchCreatedCountdownEnd={handleMatchCreatedCountdownEnd}
              indicators={indicators}
              confirmationTimeoutSeconds={confirmationTimeoutSeconds}
              matchmakingStatus={matchmakingStatus}
              defaultValue={`${MIN_DUEL_BET}`}
            />
          )}
          {!isNextSearch && <MatchmakerStatistics statistics={statistics} />}
        </div>
      )}
    </div>
  )
}

export { Matchmaker }
