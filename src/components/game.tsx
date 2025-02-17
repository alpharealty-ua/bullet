import { useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { useAppContext } from '@/context/use-app-context'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { GameOver } from './game-over'
import { Revolver } from './revolver'
import { Result } from './result'
import { Click } from './click'
import { Rules } from './rules'
import { Cover } from './cover'
import { Header } from './header'
import { Footer } from './footer'
import { Debug } from './debug'
import { AddMoneyModal } from './add-money-modal'

const Game = () => {
  const {
    state,
    balance,
    bet,
    showHelpers,
    setShowHelpers,
    settings,
    offer,
    showOffer,
    setShowOffer,
    showJackpot,
    showClick,
    disabled,
    jackpot,
    game,
    mouseClick,
    revolverRefHandle,
  } = useAppContext()

  const nodeRef = useRef(null)
  const nodeRef2 = useRef(null)
  const modal = useCustomModal()

  useEffect(() => {
    const image = new Image()
    const imageSrc = `${images.gameover}`
    image.src = imageSrc
  }, [])

  const handeInitGame = async () => {
    await mouseClick()
    game.newGame()
  }

  const handleGameRules = async () => {
    await mouseClick()
    modal.show({
      contentSlot: <Rules />,
    })
  }

  const handlePull = async () => {
    setShowHelpers(false)
    setShowOffer(false)
    await mouseClick(game.next)
  }

  const handleDeal = async () => {
    await mouseClick(game.deal)
  }

  const handleStartGame = async () => {
    await mouseClick()
    game.newGame()
  }

  const handleGameOverTimeout = () => {
    game.newGame()
  }

  const handleAddMoney = async () => {
    await mouseClick()
    modal.show({
      contentSlot: <AddMoneyModal />,
    })
  }

  return (
    <>
      <Debug disabled={disabled} />
      {state === 'cover' && (
        <Cover onStart={handeInitGame} onGameRules={handleGameRules} />
      )}
      <Header />
      <Result
        title={'Jackpot'}
        price={jackpot}
        open={showJackpot && Boolean(jackpot)}
      />
      <Result
        title={'the banker offers...'}
        price={offer}
        open={showOffer && Boolean(offer)}
      />
      {state === 'preparation' && !(balance > 0 || bet > 0) && (
        <div className='relative flex flex-col items-center justify-center pt-8'>
          <Button text='Add money' onClick={handleAddMoney} />
        </div>
      )}
      <Revolver
        ref={revolverRefHandle}
        disabled={disabled || !(state === 'preparation')}
        beforeSlot={<>{showClick && <Click />}</>}
      />
      <div
        className={cn(
          'mx-4 mt-auto mb-4 flex h-[100px] items-center justify-between',
          settings.invertButtons && 'flex-row-reverse',
        )}
      >
        <div className='relative'>
          <CSSTransition
            nodeRef={nodeRef}
            in={showOffer}
            unmountOnExit
            timeout={400}
          >
            {(state) => {
              const open = state === 'entering' || state === 'entered'
              const close = state === 'exiting' || state === 'exited'
              return (
                <div
                  ref={nodeRef}
                  className={cn(
                    'fill-mode-both relative -top-1 mt-auto',
                    open &&
                      'animate-in fade-in zoom-in-50 delay-1200 duration-1000',
                    close && 'animate-out fade-out zoom-out-50 duration-400',
                  )}
                >
                  <Button
                    disabled={disabled}
                    className='w-24'
                    image='deal'
                    onClick={handleDeal}
                  />
                </div>
              )
            }}
          </CSSTransition>
        </div>
        <div className='relative'>
          <CSSTransition
            nodeRef={nodeRef2}
            in={showHelpers && bet > 0}
            unmountOnExit
            timeout={400}
          >
            {(state) => {
              const open = state === 'entering' || state === 'entered'
              const close = state === 'exiting' || state === 'exited'
              return (
                <div
                  ref={nodeRef2}
                  key='helper'
                  className={cn(
                    'fill-mode-both absolute right-0 bottom-full w-[90px] origin-top bg-contain bg-center bg-no-repeat duration-400',
                    open && 'animate-in fade-in slide-in-from-top-4',
                    close && 'animate-out fade-out slide-out-to-top-4',
                  )}
                >
                  <img src={images.startgame} alt='' />
                </div>
              )
            }}
          </CSSTransition>
          <Button
            disabled={disabled || bet === 0}
            className='w-24'
            image='pull'
            onClick={handlePull}
          />
        </div>
      </div>
      {state === 'game-over' && (
        <GameOver
          onClick={handleStartGame}
          onTimeout={handleGameOverTimeout}
          timeout={3000}
          image={images.gameover}
          hideBlood={settings.blood}
        />
      )}
      <Footer />
    </>
  )
}

export { Game }
