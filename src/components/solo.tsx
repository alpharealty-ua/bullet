import { useState } from 'react'

import { useSettingsStore } from '@/store/settings.store'
import { useSoloStore } from '@/store/solo.store'
import { useSolo } from '@/hooks/use-solo'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { VariantGame } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { GameOver } from './game-over'
import { Revolver } from './revolver'
import { Result } from './result'
import { Header } from './header'
import { Footer } from './footer'
import { AddMoneyModal } from './add-money-modal'
import { Helper } from './helper'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { AnimationInOut } from '@/components/animation-in-out'
import { Debug } from '@/components/debug'

const Solo = ({ variant }: { variant: VariantGame }) => {
  const { next, deal, revolverRefHandle } = useSolo()
  const [showHelpers, setShowHelpers] = useState(true)
  const isStartedGame = useSoloStore(({ isStartedGame }) => isStartedGame)
  const noMoney = useSoloStore(({ noMoney }) => noMoney)
  const bet = useSoloStore(({ bet }) => bet)
  const offer = useSoloStore(({ offer }) => offer)
  const jackpot = useSoloStore(({ jackpot }) => jackpot)
  const invertButtons = useSettingsStore(({ invertButtons }) => invertButtons)

  const modal = useCustomModal()

  const handlePull = async () => {
    setShowHelpers(false)
    await next()
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
      <Debug />
      <Header logoText={'Solo'} />
      <Result
        title={'Jackpot'}
        price={jackpot}
        open={isStartedGame && Boolean(jackpot)}
      />
      <Result
        title={'the banker offers...'}
        price={offer}
        open={isStartedGame && Boolean(offer)}
      />
      {noMoney && (
        <div className='relative flex flex-col items-center justify-center pt-8'>
          <ButtonWithAudio text='Add money' onClick={handleAddMoney} />
        </div>
      )}
      <div className='relative mt-auto'>
        <Revolver
          gunHandleRef={revolverRefHandle}
          disabled={isStartedGame}
          beforeSlot={<>{}</>}
          className='-mb-16 w-[216px] lg:-mb-12 lg:w-[251px]'
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
              disabled={bet === 0}
              className='w-24'
              image='pull'
              onClick={handlePull}
            />
          </div>
        </div>
      </div>
      <GameOver />
      <Footer format='solo' variant={variant} showHelpers={showHelpers} />
    </>
  )
}

export { Solo }
