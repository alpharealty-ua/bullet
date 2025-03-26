import { useState } from 'react'

import { ROUTES } from '@/routes/path'
import { useSettingsStore } from '@/store/settings.store'
import { useGameStore } from '@/store/game.store'
import { useGame } from '@/hooks/use-game'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { VariantGame } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { GameOver } from '@/components/game-over'
import { Revolver } from '@/components/guns/revolver'
import { Result } from '@/components/result'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer-solo'
import { AddMoneyModal } from '@/components/add-money-modal'
import { Helper } from '@/components/helper'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { AnimationInOut } from '@/components/animation-in-out'
import { Victory } from '@/components/victory'

const SoloPage = ({ variant }: { variant: VariantGame }) => {
  const { next, deal, revolverRefHandle, newGame, watchGame } = useGame(variant)
  const [showHelpers, setShowHelpers] = useState(true)
  const isStartedGame = useGameStore(({ isStartedGame }) => isStartedGame)
  const noMoney = useGameStore(({ noMoney }) => noMoney)
  const bet = useGameStore(({ bet }) => bet)
  const offer = useGameStore(({ offer }) => offer)
  const jackpot = useGameStore(({ jackpot }) => jackpot)
  const invertButtons = useSettingsStore(({ invertButtons }) => invertButtons)
  const multiplier = useGameStore(({ multiplier }) => multiplier)

  const modal = useCustomModal()

  const handlePull = async () => {
    setShowHelpers(false)
    await next('solo')
  }

  const handleDeal = async () => {
    await deal()
  }

  const handleAddMoney = async () => {
    modal.show({
      contentSlot: <AddMoneyModal />,
    })
  }

  return (
    <>
      <Header logoText={'Solo'} />
      <div className='min-h-40'>
        {variant === 'watch' && watchGame && (
          <div className='flex flex-col gap-6 p-4'>
            <div className='text-3xl'>Largest prize game</div>
            <div className='align-items flex items-center justify-between'>
              <Result
                title={'Prizepool'}
                value={`$${watchGame.jackpot}`}
                open={true}
              />
              <ButtonWithAudio
                as='link'
                to={`${ROUTES.solo.watch}/${watchGame.gameId}`}
                bg='primary'
                text='Watch'
              />
            </div>
          </div>
        )}
        {variant === 'play' && (
          <div className='flex flex-col gap-3 pt-2'>
            <Result
              title={'Prizepool'}
              value={`$${jackpot}`}
              open={Boolean(jackpot)}
            />
            <Result
              title={'Multiplier'}
              value={`${multiplier}x`}
              open={multiplier > 0}
            />
            <Result
              title={'the banker offers...'}
              value={`$${offer ? offer.amount : '0'}`}
              open={isStartedGame && Boolean(offer)}
            />
          </div>
        )}
      </div>
      {noMoney && (
        <div className='relative flex flex-col items-center justify-center pt-8'>
          <ButtonWithAudio
            as='button'
            image='button'
            text='Add money'
            onClick={handleAddMoney}
          />
        </div>
      )}
      <div className='relative mt-auto flex flex-1 items-end px-8 pt-2'>
        <Revolver
          gunHandleRef={revolverRefHandle}
          disabled={isStartedGame}
          className='h-full max-h-[800px] max-w-full'
        />
        <div
          className={cn(
            'absolute right-0 bottom-4 left-0 flex items-center justify-between px-4',
            invertButtons && 'flex-row-reverse',
          )}
        >
          <div className='relative'>
            <AnimationInOut
              in={isStartedGame && Boolean(offer)}
              timeout={400}
              className={cn(
                'zoom-in-50 zoom-out-50 mt-auto',
                'data-open:delay-1200 data-open:duration-1000',
                'data-close:duration-400',
              )}
            >
              <ButtonWithAudio
                as='button'
                className='w-24'
                image='deal'
                onClick={handleDeal}
              />
            </AnimationInOut>
          </div>
          <div className='relative'>
            <Helper
              image='startgame'
              show={showHelpers && bet > 0 && !isStartedGame}
            />
            <ButtonWithAudio
              as='button'
              disabled={bet === 0}
              className='w-24'
              image='pull'
              onClick={handlePull}
              skipWaitAnimation
            />
          </div>
        </div>
      </div>
      <Victory hideLvl />
      <GameOver onClick={newGame} onTimeout={newGame} />
      <Footer />
    </>
  )
}

export { SoloPage }
