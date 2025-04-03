import { useCallback } from 'react'
import { useNavigate } from 'react-router'

import { useUser } from '@/api/auth.api'
import { useBalance } from '@/api/wallet.api'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { useMatchmakingSocket } from '@/socket/matchmaker/use-matchmaking-socket'
import { useGameStore } from '@/store/game.store'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/routes/path'
import { MIN_DUEL_BET } from '@/lib/constants'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EnterArena } from '@/components/enter-arena'
import { MatchmakerConnection } from '@/components/matchmaker-connection'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { AddMoneyModal } from '@/components/add-money-modal'
import { MatchmakerPing } from '@/components/matchmaker-ping'
import { MatchmakerStatistics } from '@/components/matchmaker-statistics'

const region = 'us-west'

const MatchmakerPage = () => {
  const { username } = useUser()
  const { data: balance } = useBalance()
  const modal = useCustomModal()
  const characterName = useGameStore(({ characterName }) => characterName)
  const token = useAuthStore(({ token }) => token)
  const noMoney = !(balance > 0)
  const canJoin = !(balance < MIN_DUEL_BET)

  const {
    toggleConnection,
    authenticated,
    joinMatchmaking,
    leaveMatchmaking,
    declineMatch,
    confirmMatch,
    pingData,
    statistics,
    matchmakingStatus,
    indicators,
    confirmationTimeoutSeconds,
    connectionStatus,
    gameId,
  } = useMatchmakingSocket(token!)

  const handleSearch = () => {
    matchmakingStatus === 'not-in-queue'
      ? joinMatchmaking({ username, characterName, region })
      : matchmakingStatus === 'searching' && leaveMatchmaking()
  }

  const handleToggleConnection = () => {
    toggleConnection()
  }

  const navigate = useNavigate()

  const handleCountdownEnd = useCallback(async () => {
    if (!gameId) {
      return
    }

    navigate(`${ROUTES.duel.play}/${gameId}`, {
      preventScrollReset: true,
    })
  }, [navigate, gameId])

  const handleAddMoney = async () => {
    modal.show({
      contentSlot: <AddMoneyModal />,
    })
  }

  return (
    <>
      <Header logoText='duel' noMoney={noMoney} headerProfile />
      <div className='flex grow flex-col items-center pt-2'>
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
          <MatchmakerConnection
            connectionStatus={connectionStatus}
            authenticated={authenticated}
            onClick={handleToggleConnection}
          />
        )}

        {canJoin && authenticated && (
          <div className='flex w-full flex-col items-center justify-center gap-3'>
            <EnterArena
              onDecline={declineMatch}
              onConfirm={confirmMatch}
              onSearch={handleSearch}
              indicators={indicators}
              confirmationTimeoutSeconds={confirmationTimeoutSeconds}
              matchmakingStatus={matchmakingStatus}
              onCountdownEnd={handleCountdownEnd}
              defaultValue={`${MIN_DUEL_BET}`}
            />
            <MatchmakerPing pingData={pingData} />
            <MatchmakerStatistics statistics={statistics} />
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export { MatchmakerPage }
