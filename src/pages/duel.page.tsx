import { useCallback, useEffect, useState } from 'react'
import { IoPlay } from 'react-icons/io5'

import { useDuelStore } from '@/store/duel.store'
import { useSoloStore } from '@/store/solo.store'
import { useSolo } from '@/hooks/use-solo'
import { IMAGES, VariantGame } from '@/lib/constants'
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
  const isStartedGame = useSoloStore(({ isStartedGame }) => isStartedGame)
  const [showPlayerInfo, setShowPlayerInfo] = useState(false)
  const visiblePlayerInfo = !isStartedGame || showPlayerInfo
  const [searched, setSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

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

  const handleSearchClick = () => {
    setIsSearching((p) => !p)
  }

  useEffect(() => {
    if (!isSearching) {
      return
    }

    const timeoutID = setTimeout(() => {
      setSearched(true)
    }, 3000)

    return () => {
      clearTimeout(timeoutID)
    }
  }, [isSearching])

  return (
    <>
      <Header
        logoText={variant === 'play' ? 'duel' : ''}
        hideBalance={variant === 'play'}
      />
      <Bar />
      {!searched && (
        <div className='relative mx-auto flex w-full max-w-46 flex-col items-center justify-center gap-2 pt-14'>
          <div className='text-2xl'>Enter arena</div>
          <div className='relative flex aspect-[1/0.31] w-full items-center justify-between px-2 pl-4 text-2xl'>
            <div
              className={cn(
                'absolute inset-0 bg-contain',
                'repeat-infinite direction-alternate duration-500 ease-linear',
                isSearching && 'animate-[pulse-enter-arena]',
              )}
              style={{ backgroundImage: `url(${IMAGES.enterarena})` }}
            ></div>
            <div className='relative'>$1000</div>
            <div
              className={cn(
                'text-red relative flex h-14 w-8.5 cursor-pointer items-center justify-center text-2xl font-bold opacity-100 transition-all',
              )}
              onClick={handleSearchClick}
            >
              {isSearching ? 'X' : <IoPlay />}
            </div>
          </div>
          {isSearching && (
            <div className={cn('px-3', 'animate-in fade-in duration-500')}>
              Searching for opponent{' '}
              <span className='repeat-infinite direction-alternate inline-block animate-[period-pulse] rounded-full align-bottom delay-0 duration-400 ease-linear'>
                .
              </span>
              <span className='repeat-infinite direction-alternate inline-block animate-[period-pulse] rounded-full align-bottom delay-200 duration-400 ease-linear'>
                .
              </span>
              <span className='repeat-infinite direction-alternate inline-block animate-[period-pulse] rounded-full align-bottom delay-400 duration-400 ease-linear'>
                .
              </span>
            </div>
          )}
        </div>
      )}

      <div className='relative mt-auto flex flex-col pt-6'>
        {searched && (
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
              onStart={handleStartReadySetPull}
              onEnd={handleEndReadySetPull}
              readySetPullHandle={readySetPullHandleRef}
            />
          </div>
        )}

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
                    disabled={!searched}
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
