import { useCallback, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { useDuelStore } from '@/store/duel.store'
import { useSoloStore } from '@/store/solo.store'
import { useSettingsStore } from '@/store/settings.store'
import { ROUTES } from '@/routes/path'
import { useSolo } from '@/hooks/use-solo'
import { VariantGame } from '@/lib/constants'
import { cn, randomIntFromInterval, wait } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Bar } from '@/components/bar/bar'
import { DuelGameBar, GameBarHandle } from '@/components/duel-game-bar'
import { Character } from '@/components/character'
import { PlayerInfo } from '@/components/player-info'
import { ReadySetPull, ReadySetPullHandle } from '@/components/ready-set-pull'
import { GameOver } from '@/components/game-over'
import { GunHandle } from '@/components/character-gun'

const DuelPage = ({ variant }: { variant: VariantGame }) => {
  const navigate = useNavigate()
  // TODO: USE DUEL
  useSolo()

  const setState = useSoloStore(({ setState }) => setState)
  const setRound = useDuelStore(({ setRound }) => setRound)
  const addRound = useDuelStore(({ addRound }) => addRound)
  const characterName = useDuelStore(({ characterName }) => characterName)
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const { gameId } = useParams<{ gameId: string }>()
  const isStartedGame = Boolean(gameId)
  const [showPlayerInfo, setShowPlayerInfo] = useState(false)
  const visiblePlayerInfo = !isStartedGame || showPlayerInfo
  // TODO: MOVE TO CONTEXT
  const gunHandleRef = useRef<GunHandle>(null)
  const gameBarRefHandle = useRef<GameBarHandle>(null)
  const readySetPullHandleRef = useRef<ReadySetPullHandle>(null)
  const disabledRef = useRef(false)

  const handlePull = async () => {
    if (disabledRef.current) {
      return
    }

    disabledRef.current = true

    const gunHandle = gunHandleRef.current
    const readySetPullHandle = readySetPullHandleRef.current
    const gameBarHandle = gameBarRefHandle.current

    if (!(gunHandle && readySetPullHandle && gameBarHandle)) {
      return
    }

    if (isStartedGame) {
      const number = await gameBarHandle.stop()
      const isGameOver = number === 5
      await wait(1000)

      await playAudio('triggerpull')
      await gunHandle.spin()
      await gunHandle.click()

      if (isGameOver) {
        await gunHandle.shot()
        // TODO: MOVE TO NEW GAME
        setRound(1)
        setState('game-over')
      } else {
        addRound()
        const duration = randomIntFromInterval(25, 50)
        await gameBarHandle.start(duration)
      }
    } else {
      const duration = randomIntFromInterval(25, 50)
      await gameBarHandle.start(duration)
      await readySetPullHandle.start()
    }

    disabledRef.current = false
  }

  const handlePlayerClick = () => setShowPlayerInfo((p) => !p)

  const handleStartReadySetPull = useCallback(async () => {}, [])

  const handleEndReadySetPull = useCallback(() => {
    navigate(`${ROUTES.duel.play}/1`)
  }, [navigate])

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
            gunHandleRef={gunHandleRef}
            beforeSlot={
              <PlayerInfo
                className='absolute top-0 right-full translate-x-5'
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
                // gunHandleRef={gunHandleRef}
                beforeSlot={
                  <PlayerInfo
                    className='absolute top-6 left-full translate-x-2'
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
            <DuelGameBar gameBarRef={gameBarRefHandle} />
          </>
        )}
      </div>
      <GameOver hasImage={false} backRouter={ROUTES.duel.play} />
      <Footer format='duel' variant={variant} />
    </>
  )
}

export { DuelPage }
