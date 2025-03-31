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
import { cn } from '@/lib/utils'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EnterArena } from '@/components/enter-arena'
import { MatchmakerConnection } from '@/components/matchmaker-connection'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { AddMoneyModal } from '@/components/add-money-modal'

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
    matchDetails,
    confirmationTimeoutSeconds,
    info,
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
            {matchDetails && (
              <div className='flex w-full flex-col gap-2'>
                <div className='px-2'>Match info</div>
                <div className='flex gap-1'>
                  <div className='flex flex-1 flex-col gap-1 bg-white p-1 text-[10px] shadow'>
                    <div>You</div>
                    <div>Ping: {info.ping} ms</div>
                    <div>Username: {username}</div>
                    <div>Region: {region}</div>
                    <div>Character name: {characterName}</div>
                  </div>
                  <div className='flex flex-1 flex-col gap-1 bg-white p-1 text-[10px] shadow'>
                    <div>Opponent</div>
                    <div>Ping: {matchDetails.opponent.ping} ms</div>
                    <div>Username: {matchDetails.opponent.username}</div>
                    <div>Region: {matchDetails.opponent.region}</div>
                    <div>
                      Character name: {matchDetails.opponent.characterName}
                    </div>
                  </div>
                  <div className='flex flex-1 flex-col gap-1 bg-white p-1 text-[10px] shadow'>
                    <div>Match ID: {matchDetails.matchId}</div>
                    <div>Ping Difference: {matchDetails.pingDifference} ms</div>
                    <div>Average Ping: {matchDetails.averagePing}</div>
                  </div>
                </div>
              </div>
            )}
            <div className='flex w-full flex-col gap-2'>
              <div className='px-2'>Your Connection</div>
              <div
                className={cn(
                  'flex items-center justify-center p-1 text-xs',
                  pingData.ping && 'bg-[#f8d7da] text-[#721c24]',
                  pingData.ping < 200 && 'bg-[#fff3cd] text-[#856404]',
                  pingData.ping < 100 && 'bg-[#d4edda] text-[#155724]',
                  !authenticated || (pingData.ping === 0 && 'bg-[#fff3cd]'),
                )}
              >
                {!authenticated || pingData.ping === 0
                  ? 'Measuring Ping: -- ms'
                  : `Current Ping: ${pingData.ping} ms`}
              </div>
              <div className='flex gap-1'>
                {[
                  {
                    label: 'Jitter',
                    value: `${pingData.jitter ?? '--'} ms`,
                  },
                  {
                    label: 'Measurements',
                    value: `${pingData.measurements ?? '--'}`,
                  },
                  {
                    label: 'Last Sequence',
                    value: `${pingData.sequence ?? '--'}`,
                  },
                ].map((el, i) => (
                  <div
                    key={i}
                    className='flex-1 bg-white p-1 text-center text-[10px] shadow'
                  >
                    {el.label}: {el.value}
                  </div>
                ))}
              </div>
              <div className='relative flex h-20 items-end justify-end gap-1 bg-[#f8f9fa]'>
                {[
                  ...Array(Math.max(20 - pingData.history.length, 0))
                    .fill(0)
                    .map((_, i) => ({ ping: 0, jitter: 0, timestamp: i })),
                  ...pingData.history,
                ].map((entry) => {
                  const MAX_PING = 300
                  const pingValue = Math.min(entry.ping, MAX_PING)

                  const height = pingValue / MAX_PING
                  return (
                    <div
                      key={entry.timestamp}
                      className={cn(
                        'h-full flex-1 rounded-sm bg-[#e74c3c]',
                        entry.ping < 200 && 'bg-[#f39c12]',
                        entry.ping < 100 && 'bg-[#2ecc71]',
                      )}
                      style={{
                        height: `${height * 100}%`,
                      }}
                      title={`Ping: ${entry.ping}ms, Jitter: ${entry.jitter}ms`}
                    ></div>
                  )
                })}
                <div className='text-red border-red absolute right-0 bottom-1/3 left-0 border-t text-right text-[7px]'>
                  <span className='absolute top-0.5 right-0'>100ms</span>
                </div>
                <div className='text-red border-red absolute right-0 bottom-2/3 left-0 border-t text-right text-[7px]'>
                  <span className='absolute top-0.5 right-0'>200ms</span>
                </div>
                <div className='text-red border-red absolute right-0 bottom-3/3 left-0 border-t text-right text-[7px]'>
                  <span className='absolute top-0.5 right-0'>300ms</span>
                </div>
              </div>
            </div>
            <div className='flex w-full flex-col gap-2'>
              <div className='px-2'>Statistics</div>
              <div className='flex gap-1'>
                {[
                  {
                    value: statistics.playersInQueue,
                    label: 'Players in Queue',
                  },
                  {
                    value: statistics.totalMatches,
                    label: 'Total Matches',
                  },
                  {
                    value: statistics.averageWaitTime,
                    label: 'Avg. Wait Time (ms)',
                  },
                ].map((el, i) => (
                  <div
                    key={i}
                    className='flex flex-1 flex-col items-center gap-1 bg-white p-1 shadow'
                  >
                    <div className='text-xl'>{el.value}</div>
                    <div className='text-xs text-[#7f8c8d]'>{el.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export { MatchmakerPage }
