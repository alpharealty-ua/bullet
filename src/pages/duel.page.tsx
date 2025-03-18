import { useCallback, useState } from 'react'

import { useGameStore } from '@/store/game.store'
import { useSolo } from '@/hooks/use-game'
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
import { EnterArena } from '@/components/enter-arena'

const DuelPage = ({ variant }: { variant: VariantGame }) => {
  const {
    next,
    newGame,
    frontCharacterHandleRef,
    backCharacterHandleRef,
    gameBarRefHandle,
    readySetPullHandleRef,
  } = useSolo(variant)
  const addRound = useGameStore(({ addRound }) => addRound)
  const characterName = useGameStore(({ characterName }) => characterName)
  const isStartedGame = useGameStore(({ isStartedGame }) => isStartedGame)
  const [showPlayerInfo, setShowPlayerInfo] = useState(false)
  const [searched, setSearched] = useState(true)
  const visiblePlayerInfo = !isStartedGame || showPlayerInfo

  const handlePull = async () => {
    await next('duel')
  }

  const handlePlayerClick = () => setShowPlayerInfo((p) => !p)

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

  return (
    <>
      <Header
        logoText={variant === 'play' ? 'duel' : ''}
        hideBalance={variant === 'play'}
      />
      {variant === 'watch' && <Bar />}
      {!searched && <EnterArena onSearch={setSearched} />}
      <div className='relative mt-auto flex flex-col gap-10 pt-6'>
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
              characterName='anime-2'
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
                  login='Suni7222'
                  win={52}
                  visible={visiblePlayerInfo}
                />
              }
            />
            <ReadySetPull readySetPullHandle={readySetPullHandleRef} />
          </div>
        )}
        {variant === 'play' && (
          <>
            <div className='relative mb-1 pb-10'>
              <Character
                className={cn('ml-6 max-h-[220px] max-w-[180px]')}
                characterName={characterName}
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
                    login='Suni7222'
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
                    disabled={!searched}
                    image='pull'
                    onClick={handlePull}
                    skipWaitAnimation
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {variant === 'play' && (
        <DuelGameBar
          gameBarRef={gameBarRefHandle}
          onChangeDirection={handleChangeDirection}
        />
      )}
      <Victory />
      <GameOver hasImage={false} onClick={newGame} onTimeout={newGame} />
      <Footer format='duel' variant={variant} />
    </>
  )
}

export { DuelPage }
