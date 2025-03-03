import { useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'

import { useDuelStore } from '@/store/duel.store'
import { useSoloStore } from '@/store/solo.store'
import { ROUTES } from '@/routes/path'
import { useSolo } from '@/hooks/use-solo'
import { images, VariantGame } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Header } from './header'
import { Footer } from './footer'
import { Bar } from '@/components/bar/bar'
import { DuelGameBar } from './duel-game-bar'
import { Character } from './character'
import { PlayerInfo } from './player-info'
import { ReadySetPull } from './ready-set-pull'
import { GameOver } from './game-over'

const Duel = ({ variant }: { variant: VariantGame }) => {
  const navigate = useNavigate()
  // TODO: USE DUEL
  useSolo()
  // TODO: USE DUEL STORE
  const setState = useSoloStore(({ setState }) => setState)
  const characterIndex = useDuelStore(({ characterIndex }) => characterIndex)
  const { gameId } = useParams<{ gameId: string }>()
  const startedGame = Boolean(gameId)
  const [showPlayerInfo, setShowPlayerInfo] = useState(false)
  const visiblePlayerInfo = !startedGame || showPlayerInfo
  // TODO: MOVE TO CONTEXT
  const gunHandleRef = useRef<{
    spin: (duration?: number) => Promise<void>
    shot: () => void
  }>(null)

  const handlePull = async () => {
    // TODO: TEMPORARY SOLUTION
    if (startedGame) {
      await gunHandleRef.current?.spin()
      gunHandleRef.current?.shot()
      setTimeout(async () => {
        setState('game-over')
        gunHandleRef.current?.shot()
      }, 700)
      return
    }
    navigate(`${ROUTES.duel.play}/1`)
  }

  const handlePlayerClick = () => setShowPlayerInfo((p) => !p)

  if (characterIndex === -1) {
    return <Navigate to={ROUTES.duel.index} />
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
              'mx-auto',
              variant === 'watch' && '-mb-7 h-[300px]',
              variant === 'play' && 'mr-12 h-[235px]',
            )}
            characterIndex={characterIndex}
            onClick={
              variant === 'play' && startedGame ? handlePlayerClick : undefined
            }
            gunHandleRef={gunHandleRef}
            beforeSlot={
              <PlayerInfo
                className='absolute top-0 right-full translate-x-5'
                side='left'
                level={53}
                login={'Suni7222'}
                win={52}
                visible={visiblePlayerInfo}
              />
            }
          />
          {startedGame && <ReadySetPull />}
        </div>
        {variant === 'play' && (
          <>
            <div className='relative mb-1'>
              <PlayerInfo
                className='absolute top-6 right-6'
                side='right'
                level={53}
                login={'Suni7222'}
                win={52}
                visible={visiblePlayerInfo}
              />
              <div
                className='relative ml-10 aspect-[190/220] w-[190px] cursor-pointer items-end justify-center bg-contain bg-center bg-no-repeat'
                style={{ backgroundImage: `url(${images.player1})` }}
                onClick={handlePlayerClick}
              ></div>
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
            <DuelGameBar />
          </>
        )}
      </div>
      <GameOver hasImage={false} />
      <Footer format='duel' variant={variant} />
    </>
  )
}

export { Duel }
