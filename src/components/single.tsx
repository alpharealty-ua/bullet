import { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { useAppContext } from '@/context/use-app-context'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GameOver } from './game-over'
import { Revolver } from './revolver'
import { Result } from './result'
import { Click } from './click'
import { Header } from './header'
import { Footer } from './footer'
import { AddMoneyModal } from './add-money-modal'
import { Helper } from './helper'

const Single = () => {
  const {
    state,
    balance,
    bet,
    showHelpers,
    settings,
    offer,
    showOffer,
    showJackpot,
    showClick,
    disabled,
    jackpot,
    game,
    mouseClick,
    revolverRefHandle,
    gameOverImage,
  } = useAppContext()

  const nodeRef = useRef(null)
  const nodeRef2 = useRef(null)
  const modal = useCustomModal()

  const handlePull = async () => {
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
          <Helper image='startgame' show={showHelpers && bet > 0} />
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
          image={gameOverImage}
          hideBlood={settings.blood}
        />
      )}
      <Footer format='single' />
    </>
  )
}

export { Single }
