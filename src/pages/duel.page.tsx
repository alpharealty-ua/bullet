import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router'

import { useUser } from '@/api/auth.api'
import { socketDuel as socketDuel } from '@/socket/socket'
import { useDuelSocket } from '@/socket/duel/use-duel-socket'
import { DuelSocketEvents } from '@/socket/duel/duel-socket-events'
import { useUnmountedState } from '@/hooks/use-unmount-state'
import { useGameStore } from '@/store/game.store'
import { useAuthStore } from '@/store/auth.store'
import { VariantGame } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Bar } from '@/components/bar/bar'
import { DuelGameBar } from '@/components/duel-game-bar'
import { Character } from '@/components/character'
import { ReadySetPull } from '@/components/ready-set-pull'
import { GameOver } from '@/components/game-over'
import { Victory } from '@/components/victory'
import { RematchRequest } from '@/components/rematch-request'
import { PageWrapper } from '@/components/page-wrapper'

const DuelPage = ({ variant }: { variant: VariantGame }) => {
  const { gameId } = useParams() as { gameId: string }
  const token = useAuthStore(({ accessToken }) => accessToken)
  const user = useUser()
  const characterName = useGameStore(({ characterName }) => characterName)
  const playerId = user.id
  const matchDetails = useGameStore(({ matchDetails }) => matchDetails)

  const duelSocketEvents = useMemo(
    () => new DuelSocketEvents(socketDuel, token!, gameId, playerId),
    [token, gameId, playerId],
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
  } = useDuelSocket({
    gameId,
    playerId,
    duelSocketEvents,
  })

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

  const isUnmounted = useUnmountedState()
  useEffect(() => {
    duelSocketEvents.connect()

    return () => {
      queueMicrotask(() => {
        if (!isUnmounted()) {
          return
        }

        duelSocketEvents.disconnect()
      })
    }
  }, [duelSocketEvents, isUnmounted])

  useEffect(() => {
    duelSocketEvents.attachEventListeners()

    return () => {
      duelSocketEvents.dettachEventListeners()
    }
  }, [duelSocketEvents])

  return (
    <PageWrapper noCentered>
      <Header logoText='Duel' />
      {variant === 'watch' && <Bar />}
      <div className='relative flex grow flex-col'>
        <DuelGameBar gameBarRef={topGameBarHandleRef} />
        <div className='grow'></div>
        <div className='relative flex w-full grow flex-col justify-end gap-10'>
          <div
            className={cn(
              'relative flex min-h-[240px] grow flex-col gap-2 pt-4',
              'animate-in fade-in duration-500',
            )}
          >
            <Character
              className={cn('mx-auto mr-12 max-h-50 w-full max-w-48')}
              name={matchDetails?.opponent.characterName ?? 'fatty'}
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
            <ReadySetPull readySetPullHandle={readySetPullHandleRef} />
          </div>
          <div className='relative flex min-h-[240px] grow items-end'>
            <Character
              className={cn('mb-10 ml-6 max-h-[220px] w-full max-w-[180px]')}
              name={characterName}
              type='back'
              onClick={handlePlayerClick}
              characterHandleRef={backCharacterHandleRef}
              playerInfoProps={{
                side: 'right',
                level: 53,
                login: user.username,
                win: 52,
              }}
            />
            <div className='absolute right-0 bottom-0 left-0 flex items-center justify-between px-4'>
              <div className='relative ml-auto'>
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
        </div>
        <RematchRequest
          onRequest={handleRequestRematch}
          onCancel={handleCancelRematch}
          rematchRequestHandleRef={rematchRequestHandleRef}
        />
        <DuelGameBar gameBarRef={bottomGameBarHandleRef} />
      </div>
      <Victory victoryHandleRef={victoryHandleRef} />
      <GameOver gameOverHandleRef={gameOverHandleRef} />
      <Footer round={round} hasPull={hasPull} prizepool={2000} />
    </PageWrapper>
  )
}

export { DuelPage }
