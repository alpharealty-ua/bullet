import { useState } from 'react'

import { useUser } from '@/api/auth.api'
import { useGameStore } from '@/store/game.store'
import { useAuthStore } from '@/store/auth.store'
import { useMatchmakingSocket } from '@/socket/matchmaker/use-matchmaking-socket'
import { ConnectionStatus } from '@/socket/matchmaker/matchmaker-soket.types'
import { useGame } from '@/hooks/use-game'
import { VariantGame } from '@/lib/constants'
import { cn, wait } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Bar } from '@/components/bar/bar'
import { DuelGameBar } from '@/components/duel-game-bar'
import { Character } from '@/components/character'
import { PlayerInfo } from '@/components/player-info'
import { ReadySetPull } from '@/components/ready-set-pull'
import { GameOver } from '@/components/game-over'
import { Victory } from '@/components/victory'
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

const DuelPage = ({ variant }: { variant: VariantGame }) => {
  const {
    next,
    newGame,
    nextRound,
    frontCharacterHandleRef,
    backCharacterHandleRef,
    gameBarRefHandle,
    readySetPullHandleRef,
  } = useGame(variant)
  const characterName = useGameStore(({ characterName }) => characterName)
  const isStartedGame = useGameStore(({ isStartedGame }) => isStartedGame)
  const round = useGameStore(({ round }) => round)
  const pullRound = useGameStore(({ pullRound }) => pullRound)
  const [showPlayerInfo, setShowPlayerInfo] = useState(false)
  const visiblePlayerInfo = !isStartedGame || showPlayerInfo
  const user = useUser()
  const token = useAuthStore(({ token }) => token)
  const hasPull = pullRound[pullRound.length - 1] !== round

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
  } = useMatchmakingSocket(token!)

  const handlePull = async () => {
    await next('duel')
  }

  const handlePlayerClick = () => setShowPlayerInfo((p) => !p)

  const handleChangeDirection = (_: number, nextDiraction: number) => {
    const isReverseDirection = nextDiraction === -1
    if (isReverseDirection) {
      return
    }

    nextRound()
  }

  const handleSearch = () => {
    matchmakingStatus === 'not-in-queue'
      ? joinMatchmaking(user.username, region)
      : matchmakingStatus === 'searching' && leaveMatchmaking()
  }

  const handleToggleConnection = () => {
    toggleConnection()
  }

  const [startedGame, setStartedGame] = useState(false)
  const matchCreated = matchmakingStatus === 'match-created'

  const handleCountdownEnd = async () => {
    await newGame()
    setStartedGame(true)
    await wait(100)
    await next('duel')
  }

  return (
    <>
      <Header logoText={variant === 'play' ? 'duel' : ''} headerProfile />
      {variant === 'watch' && <Bar />}
      {!matchCreated && (
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
      )}
      {authenticated && !matchCreated && (
        <div className='flex w-full flex-col items-center justify-center gap-3'>
          <EnterArena
            onDecline={declineMatch}
            onConfirm={confirmMatch}
            onSearch={handleSearch}
            indicators={indicators}
            confirmationTimer={confirmationTimer}
            matchmakingStatus={matchmakingStatus}
          />
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
          {matchDetails && (
            <div className='flex w-full flex-col gap-2'>
              <div className='px-2'>Match Found!</div>
              <div className='flex gap-1'>
                <div className='flex flex-1 flex-col gap-1 bg-white p-1 text-[10px] shadow'>
                  <div>You</div>
                  <div>Ping: {info.ping} ms</div>
                  <div>Username: {user.username}</div>
                  <div>Region: {region}</div>
                </div>
                <div className='flex flex-1 flex-col gap-1 bg-white p-1 text-[10px] shadow'>
                  <div>Opponent</div>
                  <div>Ping: {matchDetails.opponent.ping} ms</div>
                  <div>Username: {matchDetails.opponent.username}</div>
                  <div>Region: {matchDetails.opponent.region}</div>
                </div>
                <div className='flex flex-1 flex-col gap-1 bg-white p-1 text-[10px] shadow'>
                  <div>Match ID:</div>
                  <div>Ping Difference: {matchDetails.pingDifference} ms</div>
                  <div>Average Ping: {matchDetails.averagePing}</div>
                  <div>Game ID: {matchDetails.gameId}</div>
                </div>
              </div>
            </div>
          )}
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
      <div className='flex grow flex-col items-center justify-center'>
        {matchCreated &&
          (!startedGame ? (
            <Countdown time={3} onEnd={handleCountdownEnd} />
          ) : (
            <div className='mt-auto pt-6'>
              <div className='relative mt-auto flex flex-col gap-10'>
                <div
                  className={cn(
                    'relative flex min-h-[280px] grow-1 flex-col gap-2 pt-4',
                    'animate-in fade-in duration-500',
                  )}
                >
                  <Character
                    className={cn(
                      'mx-auto max-h-50 w-full max-w-48',
                      variant === 'watch' && '-mb-7 h-[300px]',
                      variant === 'play' && 'mr-12',
                    )}
                    name='fatty'
                    type='front'
                    onClick={
                      variant === 'play' && isStartedGame
                        ? handlePlayerClick
                        : async () => {
                            await frontCharacterHandleRef.current?.frontGunHandleRef?.current?.trigger()
                            await frontCharacterHandleRef.current?.frontGunHandleRef?.current?.spin()
                            await frontCharacterHandleRef.current?.frontGunHandleRef?.current?.click()
                            await frontCharacterHandleRef.current?.frontGunHandleRef?.current?.shot()
                          }
                    }
                    characterHandleRef={frontCharacterHandleRef}
                    beforeSlot={
                      <PlayerInfo
                        className='absolute top-0 right-full translate-x-2'
                        side='left'
                        level={53}
                        login={matchDetails?.opponent.username ?? 'username'}
                        win={52}
                        visible={visiblePlayerInfo}
                      />
                    }
                  />
                  <ReadySetPull readySetPullHandle={readySetPullHandleRef} />
                </div>
                {variant === 'play' && (
                  <div className='relative mb-1 pb-10'>
                    <Character
                      className={cn('ml-6 max-h-[220px] max-w-[180px]')}
                      name={characterName}
                      type='back'
                      onClick={
                        variant === 'play' && isStartedGame
                          ? handlePlayerClick
                          : async () => {
                              await backCharacterHandleRef.current?.backGunHandleRef?.current?.trigger()
                              await backCharacterHandleRef.current?.backGunHandleRef?.current?.spin()
                              await backCharacterHandleRef.current?.backGunHandleRef?.current?.click()
                              await backCharacterHandleRef.current?.backGunHandleRef?.current?.shot()
                            }
                      }
                      characterHandleRef={backCharacterHandleRef}
                      beforeSlot={
                        <PlayerInfo
                          className='absolute top-0 left-full translate-x-2'
                          side='right'
                          level={53}
                          login={user.username}
                          win={52}
                          visible={visiblePlayerInfo}
                        />
                      }
                    />
                    <div className='absolute right-0 bottom-0 flex items-center justify-between px-4'>
                      <div className='relative'>
                        <ButtonWithAudio
                          as='button'
                          className='w-26'
                          image='pull'
                          onClick={handlePull}
                          disabled={!hasPull}
                          skipWaitAnimation
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DuelGameBar
                gameBarRef={gameBarRefHandle}
                onChangeDirection={handleChangeDirection}
              />
            </div>
          ))}
      </div>
      <Victory hideWon />
      <GameOver hasImage={false} onClick={newGame} onTimeout={newGame} />
      <Footer hasPull={hasPull} />
    </>
  )
}

export { DuelPage }
