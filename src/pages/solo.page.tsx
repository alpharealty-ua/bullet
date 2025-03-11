import { useState } from 'react'

import { useSettingsStore } from '@/store/settings.store'
import { useSoloStore } from '@/store/solo.store'
import { useSolo } from '@/hooks/use-solo'
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
  const { next, deal, revolverRefHandle, newGame } = useSolo()
  const [showHelpers, setShowHelpers] = useState(true)
  const isStartedGame = useSoloStore(({ isStartedGame }) => isStartedGame)
  const noMoney = useSoloStore(({ noMoney }) => noMoney)
  const bet = useSoloStore(({ bet }) => bet)
  const offer = useSoloStore(({ offer }) => offer)
  const jackpot = useSoloStore(({ jackpot }) => jackpot)
  const invertButtons = useSettingsStore(({ invertButtons }) => invertButtons)
  const multiplier = useSoloStore(({ multiplier }) => multiplier)

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

  const handleGameOverClick = () => {
    newGame()
  }

  return (
    <>
      <Header logoText={'Solo'} />
      <div className='flex flex-col gap-3 pt-2'>
        <Result
          title={'Jackpot'}
          value={`$${jackpot}`}
          open={Boolean(jackpot)}
        />
        {/* <Result
          title={'the banker offers...'}
          value={`$${offer}`}
          open={isStartedGame && Boolean(offer)}
        /> */}
        <Result
          title={'Multiplier'}
          value={`${multiplier}x`}
          open={multiplier > 0}
        />
      </div>
      {noMoney && (
        <div className='relative flex flex-col items-center justify-center pt-8'>
          <ButtonWithAudio text='Add money' onClick={handleAddMoney} />
        </div>
      )}
      <div className='relative mt-auto flex flex-1 items-end overflow-hidden px-8 pt-4'>
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
      <Victory />
      <GameOver onClick={handleGameOverClick} />
      <Footer variant={variant} />
    </>
  )
}

export { SoloPage }
