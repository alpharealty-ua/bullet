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
    newGame,
    winGame,
    gameOver,
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
  const playerId = user.id
  const token = useAuthStore(({ token }) => token)
  const hasPull = pullRound[pullRound.length - 1] !== round
  const gameInstance = useMemo(
    () =>
      new GameSocket(token!, user.id, gameId, {
        onPullResult: async (result) => {
          const isPlayer = playerId === result.playerId

          const pull = isPlayer ? playerPull : opponentPull

          await pull(result.fired)
          if (result.fired) {
            isPlayer ? winGame() : gameOver()
          }
        },
        onProbability: (data) => {
          gameBarRefHandle.current?.setActive(data.index)
        },
        onReadyTakePull: (data) => {
          readySetPullHandleRef.current?.start(data)
        },
        onPlayerWon: (data) => {
          const isWin = data.playerId === playerId
          console.log({ isWin })
        },
        onEnded: (data) => {
          if (data.winner) {
            if (data.winner.id === playerId) {
              console.log(`I WON THE GAME!`)
            } else {
              console.log(`I lost the game.`)
            }
          } else {
            // draw()
          }
        },
        onRoundCurrent: () => {},
      }),
    [token, gameBarRefHandle, readySetPullHandleRef],
  )

  const matchDetails = { opponent: { username: 'opponent' } }

  const handlePull = async () => {
    gameInstance.pullTrigger()
    await gameBarRefHandle.current?.highlight()
  }

  const opponentPull = async (shot: boolean) => {
    await frontCharacterHandleRef.current?.frontGunHandleRef?.current?.trigger()
    await frontCharacterHandleRef.current?.frontGunHandleRef?.current?.spin()
    await frontCharacterHandleRef.current?.frontGunHandleRef?.current?.click()
    shot &&
      (await frontCharacterHandleRef.current?.frontGunHandleRef?.current?.shot())
  }

  const playerPull = async (shot: boolean) => {
    await backCharacterHandleRef.current?.backGunHandleRef?.current?.trigger()
    await backCharacterHandleRef.current?.backGunHandleRef?.current?.spin()
    await backCharacterHandleRef.current?.backGunHandleRef?.current?.click()
    shot &&
      (await backCharacterHandleRef.current?.backGunHandleRef?.current?.shot())
  }

  const handlePlayerClick = () => setShowPlayerInfo((p) => !p)

  const isUnmounted = useRef(false)

  useEffect(() => {
    gameInstance.connect()
    isUnmounted.current = false

    return () => {
      gameInstance.dettachEventListeners()
      isUnmounted.current = true
      Promise.resolve().then(() => {
        if (!isUnmounted.current) {
          return
        }
        gameInstance.disconnect()
      })
    }
  }, [gameInstance, playerId, gameId])

  return (
    <>
      <Header logoText={variant === 'play' ? 'duel' : ''} headerProfile />
      {variant === 'watch' && <Bar />}
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
            onChangeDirection={() => {}}
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
