import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { useUser } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { useDuelSocket } from '@/socket/game/use-duel-socket'
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
import { PlayerInfo } from '@/components/player-info'
import { ReadySetPull } from '@/components/ready-set-pull'
import { GameOver } from '@/components/game-over'
import { Victory } from '@/components/victory'
import { Indicators } from '@/components/indicators'

const DuelPage = ({ variant }: { variant: VariantGame }) => {
  const navigate = useNavigate()
  const { gameId } = useParams() as { gameId: string }
  const user = useUser()
  const characterName = useGameStore(({ characterName }) => characterName)
  const [showPlayerInfo, setShowPlayerInfo] = useState(false)
  const playerId = user.id
  const token = useAuthStore(({ token }) => token)

  const {
    frontCharacterHandleRef,
    backCharacterHandleRef,
    gameBarRefHandle,
    readySetPullHandleRef,
    round,
    pullTrigger,
    requestRematch,
    isStartedGame,
    hasPull,
    gameState,
    newGame,
    rematchState,
    requestIndicator,
  } = useDuelSocket({ token: token!, gameId, playerId })

  const visiblePlayerInfo = showPlayerInfo

  const matchDetails = { opponent: { username: 'opponent' } }

  const handlePull = async () => {
    pullTrigger()
  }

  const handleRequestRematch = async () => {
    requestRematch()
  }

  const handleCancelRematch = async () => {
    navigate(ROUTES.duel.play)
  }

  const handlePlayerClick = () => setShowPlayerInfo((p) => !p)

  return (
    <>
      <Header logoText={variant === 'play' ? 'duel' : ''} headerProfile />
      {variant === 'watch' && <Bar />}
      <div className='relative flex grow flex-col items-center justify-center'>
        <div className='absolute top-4 z-3 flex flex-col items-center justify-center gap-4 text-center'>
          {gameState === 'preperation' && rematchState !== 'hide' && (
            <>
              <div className='text-2xl'>Request rematch</div>
              <Indicators
                indicators={[
                  { confirm: requestIndicator.player },
                  { confirm: requestIndicator.opponnent },
                ]}
              />
              <div className='flex justify-between gap-4'>
                <ButtonWithAudio
                  as='button'
                  bg='green'
                  className='w-full text-sm'
                  onClick={handleRequestRematch}
                >
                  Request
                </ButtonWithAudio>
                <ButtonWithAudio
                  as='button'
                  bg='red'
                  className='w-full text-sm'
                  onClick={handleCancelRematch}
                >
                  Cancel
                </ButtonWithAudio>
              </div>
            </>
          )}
        </div>
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
                name={'fatty'}
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
            )}
          </div>
          <DuelGameBar
            gameBarRef={gameBarRefHandle}
            onChangeDirection={() => {}}
          />
        </div>
      </div>
      <Victory show={gameState === 'win'} type='win' hideWon />
      <Victory show={gameState === 'draw'} type='draw' hideWon />
      <GameOver
        show={gameState === 'lose'}
        onClick={newGame}
        onTimeout={() => {}}
      />
      <Footer round={round} hasPull={hasPull} />
    </>
  )
}

export { DuelPage }
