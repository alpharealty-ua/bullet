import { useCallback } from 'react'
import { useNavigate } from 'react-router'

import { useBalance } from '@/api/wallet.api'
import { useMatchmakingSocket } from '@/socket/matchmaker/use-matchmaking-socket'
import { MatchmakerSocketEvents } from '@/socket/matchmaker/matchmaker-socket'
import { ROUTES } from '@/routes/path'
import { MIN_DUEL_BET } from '@/lib/constants'
import { EnterArena } from '@/components/matchmaker/enter-arena'
import { MatchmakerStatistics } from '@/components/matchmaker/matchmaker-statistics'
import { NextSearch } from '@/components/matchmaker/next-search'
import { AddMoneyButton } from '@/components/ui/add-money-button'
import { MatchmakerPersonalStatistics } from '@/components/matchmaker/matchmaker-personal-statistics'
import { MatchmakerTrophies } from '@/components/matchmaker//matchmaker-trophies'

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
  const noMoney = balance < MIN_DUEL_BET

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
  } = useMatchmakingSocket(matchmakerEvents, autoJoin && !noMoney)

  const handleSearch = () => {
    matchmakingStatus === 'not-in-queue'
      ? joinMatchmaking()
      : matchmakingStatus === 'searching' && leaveMatchmaking()
  }

  const handleMatchCreatedCountdownEnd = useCallback(async () => {
    if (!gameId) {
      return
    }

    navigate(ROUTES.duel.game(gameId), {
      preventScrollReset: true,
    })
  }, [navigate, gameId])

  const handleLeave = () => {
    leaveMatchmaking()
    navigate(ROUTES.duel.enterArena)
  }

  return (
    <div className='my-auto w-full'>
      {noMoney && <AddMoneyButton />}
      {!noMoney && (
        <div className='flex w-full flex-col items-center justify-center gap-3'>
          {isNextSearch && (
            <NextSearch
              matchmakingStatus={matchmakingStatus}
              onMatchCreatedCountdownEnd={handleMatchCreatedCountdownEnd}
              onLeave={handleLeave}
            />
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
          {!isNextSearch && <MatchmakerPersonalStatistics />}
          {!isNextSearch && <MatchmakerStatistics statistics={statistics} />}
          {!isNextSearch && <MatchmakerTrophies />}
        </div>
      )}
    </div>
  )
}

export { Matchmaker }
