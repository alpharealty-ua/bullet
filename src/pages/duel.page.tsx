import { useCallback, useState } from 'react'
import { useParams } from 'react-router'

import { useDuelStore } from '@/store/duel.store'
import { useSolo } from '@/hooks/use-solo'
import { VariantGame } from '@/lib/constants'
import { cn, randomIntFromInterval } from '@/lib/utils'
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
  // TODO: USE DUEL
  const {
    next,
    newGame,
    frontGunHandleRef,
    backGunHandleRef,
    gameBarRefHandle,
    readySetPullHandleRef,
  } = useSolo()

  const addRound = useDuelStore(({ addRound }) => addRound)
  const characterName = useDuelStore(({ characterName }) => characterName)
  const { gameId } = useParams<{ gameId: string }>()
  const isStartedGame = Boolean(gameId)
  const [showPlayerInfo, setShowPlayerInfo] = useState(false)
  const visiblePlayerInfo = !isStartedGame || showPlayerInfo

  const handlePull = async () => {
    await next('duel')
  }

  const handlePlayerClick = () => setShowPlayerInfo((p) => !p)

  const handleStartReadySetPull = useCallback(async () => {}, [])

  const handleEndReadySetPull = useCallback(async () => {
    const gameBarHandle = gameBarRefHandle.current

    if (gameBarHandle === null) {
      return
    }

    const duration = randomIntFromInterval(25, 50)
    await gameBarHandle.start(duration)
  }, [gameBarRefHandle])

  const handleChangeDirection = useCallback(
    (_: number, nextDiraction: number) => {
      const isReverseDirection = nextDiraction === -1
      if (isReverseDirection) {
        return
      }

      addRound()
    },
    [addRound],
  )

  const handleGameOverClick = () => {
    newGame()
  }

  return (
    <>
      <Header
        logoText={variant === 'play' ? 'duel' : ''}
        hideBalance={variant === 'play'}
      />
      <Bar />
      <div className='mt-auto flex flex-col pt-6'>
        <div className='relative flex min-h-[280px] grow-1 flex-col gap-2 pt-4'>
          <Character
            className={cn(
              'mx-auto max-h-50 w-full max-w-48',
              variant === 'watch' && '-mb-7 h-[300px]',
              variant === 'play' && 'mr-12',
            )}
            characterName='fatty'
            type='front'
            onClick={
              variant === 'play' && isStartedGame
                ? handlePlayerClick
                : undefined
            }
            frontGunHandleRef={frontGunHandleRef}
            beforeSlot={
              <PlayerInfo
                className='absolute top-0 right-full translate-x-2'
                side='left'
                level={53}
                login='Suni7222'
                win={52}
                visible={visiblePlayerInfo}
              />
            }
          />
          <ReadySetPull
            show={isStartedGame}
            onStart={handleStartReadySetPull}
            onEnd={handleEndReadySetPull}
            readySetPullHandle={readySetPullHandleRef}
          />
        </div>
        {variant === 'play' && (
          <>
            <div className='relative mb-1'>
              <Character
                className={cn('ml-6 max-h-[220px] max-w-[180px]')}
                characterName={characterName}
                type='back'
                onClick={
                  variant === 'play' && isStartedGame
                    ? handlePlayerClick
                    : undefined
                }
                backGunHandleRef={backGunHandleRef}
                beforeSlot={
                  <PlayerInfo
                    className='absolute top-0 left-full translate-x-2'
                    side='right'
                    level={53}
                    login='Suni7222'
                    win={52}
                    visible={visiblePlayerInfo}
                  />
                }
              />
              <div className='absolute right-0 bottom-0 flex items-center justify-between px-4'>
                <div className='relative'>
                  <ButtonWithAudio
                    className='w-26'
                    image='pull'
                    onClick={handlePull}
                  />
                </div>
              </div>
            </div>
            <DuelGameBar
              gameBarRef={gameBarRefHandle}
              onChangeDirection={handleChangeDirection}
            />
          </>
        )}
      </div>
      <Victory />
      <GameOver hasImage={false} onClick={handleGameOverClick} />
      <Footer format='duel' variant={variant} />
    </>
  )
}

export { DuelPage }
