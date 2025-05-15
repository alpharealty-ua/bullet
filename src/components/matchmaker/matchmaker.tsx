import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { useBalance } from '@/api/wallet.api'
import { useMatchmakingSocket } from '@/socket/matchmaker/use-matchmaking-socket'
import { useUser } from '@/api/auth.api'
import { useDuelStore } from '@/store/duel.store'
import { useMatchmakerStore } from '@/store/matchmaker.store'
import { ROUTES } from '@/routes/path'
import { MIN_DUEL_BET } from '@/lib/constants'
import { EnterArena } from '@/components/matchmaker/enter-arena'
import { NextSearch } from '@/components/matchmaker/next-search'
import { AddMoneyButton } from '@/components/ui/add-money-button'
import { PersonalStatistics } from '@/components/player/personal-statistics'
import { Trophies } from '@/components/player/trophies'
import { RecentGames } from '@/components/player/recent-games'

interface MatchmakerProps {
  autoJoin?: boolean
  isNextSearch?: boolean
}

const Matchmaker = ({ autoJoin, isNextSearch }: MatchmakerProps) => {
  const user = useUser()
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

  const { joinMatchmaking, leaveMatchmaking, declineMatch, confirmMatch } =
    useMatchmakingSocket({
      autoJoin: Boolean(autoJoin && !noMoney),
      metadata: metadata,
    })

  const handleSearch = () => {
    const matchmakingStatus = useMatchmakerStore.getState().matchmakingStatus
    matchmakingStatus === 'not-in-queue'
      ? joinMatchmaking()
      : matchmakingStatus === 'searching' && leaveMatchmaking()
  }

  const handleMatchCreatedCountdownEnd = useCallback(async () => {
    const gameId = useMatchmakerStore.getState().gameId

    if (!gameId) {
      return
    }

    navigate(ROUTES.duel.game(gameId), {
      preventScrollReset: true,
    })
  }, [navigate])

  const handleLeave = () => {
    leaveMatchmaking()
    navigate(ROUTES.duel.enterArena)
  }

  return (
    <div className='my-auto h-full w-full overflow-hidden py-3'>
      {noMoney && <AddMoneyButton />}
      {!noMoney && (
        <div className='flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden'>
          {isNextSearch ? (
            <NextSearch
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
                defaultValue={`${MIN_DUEL_BET}`}
              />
              <PersonalStatistics playerId={user.id} />
              <RecentGames playerId={user.id} short />
              <Trophies playerId={user.id} />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export { Matchmaker }
