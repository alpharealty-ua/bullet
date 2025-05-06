import { useEffect, useMemo } from 'react'
import { useLocation, useParams } from 'react-router'

import { useUser } from '@/api/auth.api'
import { useUserStatistics } from '@/api/leaderboard.api'
import { socketDuel, socketMatchmaker } from '@/socket/socket'
import { cn } from '@/lib/utils'
import { useDuelSocket } from '@/socket/duel/use-duel-socket'
import { DuelSocketEvents } from '@/socket/duel/duel-socket-events'
import { useUnmountedState } from '@/hooks/use-unmount-state'
import { useGameStore } from '@/store/game.store'
import { useAuthStore } from '@/store/auth.store'
import { VariantGame } from '@/lib/constants'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { DuelFooter } from '@/components/duel/footer-duel'
import { Bar } from '@/components/bar/bar'
import { DuelGameBar } from '@/components/duel/duel-game-bar'
import { Character } from '@/components/duel/character'
import { ReadySetPull } from '@/components/duel/ready-set-pull'
import { GameOver } from '@/components/game-over'
import { Victory } from '@/components/victory'
import { RematchRequest } from '@/components/rematch-request'
import { Matchmaker } from '@/components/matchmaker/matchmaker'
import { MatchmakerSocketEvents } from '@/socket/matchmaker/matchmaker-socket'
import { AnimationInOut } from '@/components/ui/animation-in-out'

const DuelPage = ({ variant }: { variant: VariantGame }) => {
  const { gameId = null } = useParams() as { gameId?: string }
  const token = useAuthStore(({ accessToken }) => accessToken)
  const user = useUser()
  const { data: userStatistics } = useUserStatistics()
  const characterName = useGameStore(({ characterName }) => characterName)
  const playerId = user.id
  const matchDetails = useGameStore(({ matchDetails }) => matchDetails)
  const { pathname } = useLocation()
  const typePage: 'enter-arena' | 'next' | 'duel' =
    (['enter-arena', 'next'] as const).find((s) => pathname.includes(s)) ??
    'duel'

  const duelSocketEvents = useMemo(
    () => new DuelSocketEvents(socketDuel, token!),
    [token],
  )

  const {
    gameOverHandleRef,
    victoryHandleRef,
    frontCharacterHandleRef,
    backCharacterHandleRef,
    topGameBarHandleRef,
    bottomGameBarHandleRef,
    readySetPullHandleRef,
    rematchRequestHandleRef,
    round,
    pull,
    requestRematch,
    cancelRematch,
    hasPull,
    canPull,
  } = useDuelSocket({
    gameId,
    playerId,
    duelSocketEvents,
  })

  const matchmakerEvents = useMemo(
    () =>
      new MatchmakerSocketEvents(socketMatchmaker, token!, {
        username: user.username,
        characterName,
        region: 'us-west',
      }),
    [characterName, token, user.username],
  )

  const handlePull = async () => {
    await pull()
  }

  const handleRequestRematch = async () => {
    requestRematch()
  }

  const handleCancelRematch = async () => {
    cancelRematch()
  }

  const handlePlayerClick = () => {
    frontCharacterHandleRef.current?.toggleInfo()
    backCharacterHandleRef.current?.toggleInfo()
  }

  const handleGameOverClick = async () => {
    await gameOverHandleRef.current?.hide()
  }

  // TODO: REFACTOR. FIND ANOTHER WAY PREVENT DISCONNECT WHEN HMR
  const isUnmounted = useUnmountedState()
  useEffect(() => {
    duelSocketEvents.connect()
    matchmakerEvents.connect()

    return () => {
      queueMicrotask(() => {
        if (!isUnmounted()) {
          return
        }

        duelSocketEvents.disconnect()
        matchmakerEvents.disconnect()
      })
    }
  }, [duelSocketEvents, matchmakerEvents, isUnmounted, gameId])

  useEffect(() => {
    matchmakerEvents.attachEventListeners()
    duelSocketEvents.attachEventListeners()

    return () => {
      matchmakerEvents.dettachEventListeners()
      duelSocketEvents.dettachEventListeners()
    }
  }, [duelSocketEvents, matchmakerEvents, gameId])

  return (
    <>
      {variant === 'watch' && <Bar />}
      <div className='relative flex grow flex-col'>
        {typePage !== 'enter-arena' && (
          <DuelGameBar gameBarRef={topGameBarHandleRef} />
        )}
        <div className='relative flex min-h-148 w-full grow flex-col justify-end gap-10 py-5'>
          <AnimationInOut
            in={typePage !== 'duel'}
            className={cn(
              'absolute inset-0 z-3 flex w-full items-center',
              'transition-none',
              typePage === 'next' &&
                'slide-in-from-top-10 slide-out-to-top-10 top-20 bottom-auto',
            )}
          >
            {typePage !== 'duel' && (
              <Matchmaker
                matchmakerEvents={matchmakerEvents}
                isNextSearch={typePage === 'next'}
                autoJoin={typePage === 'next'}
              />
            )}
          </AnimationInOut>
          <AnimationInOut
            in={typePage === 'duel'}
            className={cn(
              'relative flex min-h-64 w-full grow items-end',
              'slide-in-from-top-10 slide-out-to-top-10',
            )}
          >
            <Character
              className='mr-12 ml-auto max-h-50 w-full max-w-48'
              name={matchDetails?.opponent.characterName}
              type='front'
              onClick={handlePlayerClick}
              characterHandleRef={frontCharacterHandleRef}
              playerInfoProps={{
                side: 'left',
                level: 53,
                login: matchDetails?.opponent.username ?? 'username',
                win: 52,
              }}
            />
          </AnimationInOut>
          <AnimationInOut
            in={typePage !== 'enter-arena'}
            className={cn(
              'relative flex min-h-64 w-full grow items-end',
              'slide-in-from-bottom-10 slide-out-to-bottom-10',
            )}
          >
            <Character
              className='mr-auto ml-12 max-h-50 w-full max-w-48'
              name={characterName}
              type='back'
              onClick={handlePlayerClick}
              characterHandleRef={backCharacterHandleRef}
              playerInfoProps={
                userStatistics
                  ? {
                      side: 'right',
                      level: userStatistics.lvl,
                      login: userStatistics.username,
                      win: Number(userStatistics.winRate.toFixed(2)),
                    }
                  : undefined
              }
            />
            <AnimationInOut
              in={typePage === 'duel'}
              className='absolute right-0 bottom-0 left-0 flex items-center justify-between px-4'
            >
              <div className='relative ml-auto'>
                <ButtonWithAudio
                  as='button'
                  className='w-26'
                  image='pull'
                  onClick={handlePull}
                  disabled={!hasPull || !canPull}
                  skipWaitAnimation
                />
              </div>
            </AnimationInOut>
          </AnimationInOut>
          <ReadySetPull
            readySetPullHandle={readySetPullHandleRef}
            className='absolute top-1/2 left-10 -mt-10 -translate-y-1/2'
          />
        </div>
        <RematchRequest
          onRequest={handleRequestRematch}
          onCancel={handleCancelRematch}
          rematchRequestHandleRef={rematchRequestHandleRef}
        />
        {typePage !== 'enter-arena' && (
          <DuelGameBar gameBarRef={bottomGameBarHandleRef} />
        )}
      </div>
      <Victory victoryHandleRef={victoryHandleRef} />
      <GameOver
        gameOverHandleRef={gameOverHandleRef}
        onClick={handleGameOverClick}
      />
      {typePage !== 'enter-arena' && (
        <DuelFooter round={round} hasPull={hasPull} prizepool={2000} />
      )}
    </>
  )
}

export { DuelPage }
