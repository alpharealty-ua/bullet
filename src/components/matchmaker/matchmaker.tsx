import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { useBalance } from '@/api/wallet.api'
import { useMatchmakingSocket } from '@/socket/matchmaker/use-matchmaking-socket'
import { useUser } from '@/api/auth.api'
import { useDuelStore } from '@/store/duel.store'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/routes/path'
import { MIN_DUEL_BET } from '@/lib/constants'
import { EnterArena } from '@/components/matchmaker/enter-arena'
import { NextSearch } from '@/components/matchmaker/next-search'
import { AddMoneyButton } from '@/components/ui/add-money-button'
import { MatchmakerPersonalStatistics } from '@/components/matchmaker/matchmaker-personal-statistics'
import { MatchmakerTrophies } from '@/components/matchmaker//matchmaker-trophies'
import { MatchmakerPersonalRecentGames } from '@/components/matchmaker/matchmaker-recent-games'

const Matchmaker = ({
  autoJoin,
  isNextSearch,
}: {
  autoJoin?: boolean
  isNextSearch?: boolean
}) => {
  const user = useUser()
  const token = useAuthStore(({ accessToken }) => accessToken)
  const characterName = useDuelStore(({ characterName }) => characterName)
  const navigate = useNavigate()
  const { data: balance } = useBalance()
  const noMoney = balance < MIN_DUEL_BET

  const metadata = useMemo(
    () => ({
      username: user.username,
      characterName,
      region: 'us-west',
    }),
    [user, characterName],
  )

  const {
    joinMatchmaking,
    leaveMatchmaking,
    declineMatch,
    confirmMatch,
    matchmakingStatus,
    indicators,
    confirmationTimeoutSeconds,
    gameId,
  } = useMatchmakingSocket({
    token: token!,
    autoJoin: Boolean(autoJoin && !noMoney),
    metadata,
  })

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
    <div className='my-auto h-full w-full overflow-hidden py-3'>
      {noMoney && <AddMoneyButton />}
      {!noMoney && (
        <div className='flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden'>
          {isNextSearch ? (
            <NextSearch
              matchmakingStatus={matchmakingStatus}
              onMatchCreatedCountdownEnd={handleMatchCreatedCountdownEnd}
              onLeave={handleLeave}
            />
          ) : (
            <>
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
              <MatchmakerPersonalStatistics />
              <MatchmakerPersonalRecentGames short />
              <MatchmakerTrophies />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export { Matchmaker }
