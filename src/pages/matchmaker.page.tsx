import { useNavigate } from 'react-router'

import { useUser } from '@/api/auth.api'
import { useMatchmakingSocket } from '@/socket/matchmaker/use-matchmaking-socket'
import { ConnectionStatus } from '@/socket/matchmaker/matchmaker-soket.types'
import { useGameStore } from '@/store/game.store'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/routes/path'
import { cn } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EnterArena } from '@/components/enter-arena'
import { Countdown } from '@/components/countdown'

const region = 'us-west'

const connectionStatusMap: Record<ConnectionStatus, string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  authenticating: 'Authenticating',
  authenticated: 'Authenticated',
  'not-authenticated': 'Not authenticated',
  'authentication-failed': 'Authentication failed',
}

const MatchmakerPage = () => {
  const { username } = useUser()
  const characterName = useGameStore(({ characterName }) => characterName)
  const token = useAuthStore(({ token }) => token)

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
    confirmationTimer,
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

  const handleCountdownEnd = async () => {
    if (!matchDetails) {
      return
    }
    navigate(`${ROUTES.duel.play}/${gameId}`, {
      preventScrollReset: true,
    })
  }

  return (
    <>
      <Header logoText='duel' headerProfile />
      <div className='flex w-full items-center justify-center gap-4'>
        <div
          className={cn(
            'w-full flex-1 p-2 text-xs',
            (connectionStatus === 'authentication-failed' ||
              connectionStatus === 'not-authenticated' ||
              connectionStatus === 'disconnected') &&
              'bg-[#f8d7da] text-[#721c24]',
            (connectionStatus === 'connected' ||
              connectionStatus === 'authenticated') &&
              'bg-[#d4edda] text-[#155724]',
            connectionStatus === 'authenticating' &&
              'bg-[#fff3cd] text-[#856404]',
          )}
        >
          {connectionStatusMap[connectionStatus]}
        </div>
        <div className='flex-1'>
          <ButtonWithAudio
            as='button'
            bg={authenticated ? 'red' : 'green'}
            className={cn('w-full px-1 text-xs')}
            onClick={handleToggleConnection}
            disabled={['authenticating'].includes(connectionStatus)}
          >
            {authenticated ? 'Disconnect' : 'Connect to Matchmaker'}
          </ButtonWithAudio>
        </div>
      </div>
      <div className='flex grow flex-col items-center'>
        {authenticated && (
          <div className='flex w-full flex-col items-center justify-center gap-3'>
            <EnterArena
              onDecline={declineMatch}
              onConfirm={confirmMatch}
              onSearch={handleSearch}
              indicators={indicators}
              confirmationTimer={confirmationTimer}
              matchmakingStatus={matchmakingStatus}
            />
            {matchDetails && <Countdown time={1} onEnd={handleCountdownEnd} />}
            {matchDetails && (
              <div className='flex w-full flex-col gap-2'>
                <div className='px-2'>Match Found!</div>
                <div className='flex gap-1'>
                  <div className='flex flex-1 flex-col gap-1 bg-white p-1 text-[10px] shadow'>
                    <div>You</div>
                    {/* TODO: GET INFO FROM matchDetails */}
                    <div>Ping: {info.ping} ms</div>
                    <div>Username: {username}</div>
                    <div>Region: {region}</div>
                  </div>
                  <div className='flex flex-1 flex-col gap-1 bg-white p-1 text-[10px] shadow'>
                    <div>Opponent</div>
                    <div>Ping: {matchDetails.opponent.ping} ms</div>
                    <div>Username: {matchDetails.opponent.username}</div>
                    <div>Region: {matchDetails.opponent.region}</div>
                  </div>
                  <div className='flex flex-1 flex-col gap-1 bg-white p-1 text-[10px] shadow'>
                    <div>Match ID: {matchDetails.matchId}</div>
                    <div>Ping Difference: {matchDetails.pingDifference} ms</div>
                    <div>Average Ping: {matchDetails.averagePing}</div>
                    <div>Game ID: {matchDetails.gameId}</div>
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
                  { label: 'Jitter', value: `${pingData.jitter ?? '--'} ms` },
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
