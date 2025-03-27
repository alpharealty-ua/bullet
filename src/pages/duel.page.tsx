import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { useUser } from '@/api/auth.api'
import { useGameStore } from '@/store/game.store'
import { useAuthStore } from '@/store/auth.store'
import { GameSocket } from '@/socket/game/game-socket'
import { useGame } from '@/hooks/use-game'
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
  const { gameId } = useParams() as { gameId: string }
  const characterName = useGameStore(({ characterName }) => characterName)
  const isStartedGame = useGameStore(({ isStartedGame }) => isStartedGame)
  const round = useGameStore(({ round }) => round)
  const pullRound = useGameStore(({ pullRound }) => pullRound)
  const [showPlayerInfo, setShowPlayerInfo] = useState(false)
  const visiblePlayerInfo = !isStartedGame || showPlayerInfo
  const user = useUser()
  const token = useAuthStore(({ token }) => token)
  const hasPull = pullRound[pullRound.length - 1] !== round
  const gameInstance = useMemo(() => new GameSocket(token!), [token])

  const matchDetails = { opponent: { username: 'opponent' } }

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

  const connect = () => {
    const playerId = ''

    if (!(gameId && playerId)) {
      return
    }

    gameInstance.joinDuelGame(gameId, playerId)
  }

  const isUnmount = useRef(false)

  useEffect(() => {
    gameInstance.connect()
    isUnmount.current = true

    return () => {
      isUnmount.current = false
      Promise.resolve().then(() => {
        if (isUnmount.current) {
          return
        }
        gameInstance.disconnect()
      })
    }
  }, [gameInstance])

  return (
    <>
      <Header logoText={variant === 'play' ? 'duel' : ''} headerProfile />
      {variant === 'watch' && <Bar />}
      <button onClick={connect}>
        gameId - {gameId} playerId - {'info.playerId'}
      </button>
      <div className='flex grow flex-col items-center justify-center'>
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
      </div>
      <Victory hideWon />
      <GameOver hasImage={false} onClick={newGame} onTimeout={newGame} />
      <Footer hasPull={hasPull} />
    </>
  )
}

export { DuelPage }
