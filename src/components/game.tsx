import { useRef } from 'react'
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
import { AddMoneyModal } from './add-money-modal'
import { Bet } from './bet'

const Game = () => {
  const {
    state,
    format,
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

  const handleStartSingle = async () => {
    await mouseClick()
    game.newGame('single')
  }

  const handleStartDuel = async () => {
    await mouseClick()
    game.newGame('duel')
  }

  const handleGameRules = async () => {
    await mouseClick()
    modal.show({
      contentSlot: <Rules />,
    })
  }

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
      {state === 'cover' && (
        <Cover
          onStartSingle={handleStartSingle}
          onStartDuel={handleStartDuel}
          onGameRules={handleGameRules}
        />
      )}
      <Header />
      {format === 'duel' && (
        <div className='flex'>
          <div className='relative grow rounded-xl border-2 border-black bg-[#ff0000] py-3 pl-10 text-white'>
            <div className='absolute top-0 right-0 bottom-0 flex items-center'>
              <div className='relative w-6'>
                <div className='absolute top-1/2 left-1/2 -translate-1/2 rotate-90 font-bold whitespace-nowrap uppercase'>
                  Chat
                </div>
              </div>
              <div className='absolute top-1/2 left-0 w-0'></div>
            </div>
          </div>
          <div className='relative grow rounded-xl border-2 border-black bg-[#006100] py-3 pl-10 text-white'>
            <div className='absolute top-0 bottom-0 left-0 flex items-center'>
              <div className='relative w-6'>
                <div className='absolute top-1/2 left-1/2 -translate-1/2 -rotate-90 font-bold whitespace-nowrap uppercase'>
                  SIDE BETS
                </div>
              </div>
              <div className='absolute top-1/2 left-0 w-0'></div>
            </div>
            <div className='flex rounded-lg border-2 bg-white text-sm text-black'>
              <div className='flex flex-col gap-2 p-2'>
                <h3>PLACE WAGERS ON LIVE GAMES</h3>
                <ul className='flex flex-col gap-0.5'>
                  <li>
                    BET ON: <span className='text-[#006100]'>YOKOZUNA</span>{' '}
                    <button className='inline-flex h-4 w-4 rounded-full border-2 border-black bg-[#006100] align-middle'></button>
                  </li>
                  <li>Survival ODDS: 66.6%</li>
                  <li>BETTING ODDS: -200</li>
                </ul>
                <div className='py-8'>
                  <Bet label='' />
                </div>
                <div className='flex justify-end'>
                  <button
                    className={cn(
                      'relative inline-flex cursor-pointer items-center justify-center rounded-sm border-2 border-black bg-[#006100] bg-contain bg-center bg-no-repeat px-3 py-1 transition-transform active:scale-75 disabled:scale-100 disabled:cursor-not-allowed',
                    )}
                  >
                    <span className='text-xl font-bold text-white uppercase'>
                      Bet
                    </span>
                  </button>
                </div>
              </div>
              <div className='w-0.5 shrink-0 bg-black'></div>
              <div className='flex flex-col justify-between p-2'>
                <table className='text-left text-xs'>
                  <thead>
                    <tr>
                      <th className='py-0.5'>USER</th>
                      <th className='py-0.5'>RISK</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <td className='py-0.5'>BILL2</td>
                      <td className='py-0.5 text-[#006100]'>$1000</td>
                    </tr>
                    <tr>
                      <td className='py-0.5'>HARVY</td>
                      <td className='py-0.5 text-[#ff0000]'>$500</td>
                    </tr>
                    <tr className=''>
                      <td className='py-0.5'>SMART</td>
                      <td className='py-0.5 text-[#ff0000]'>$1000</td>
                    </tr>
                    <tr>
                      <td className='py-0.5'>FIREA</td>
                      <td className='py-0.5 text-[#ff0000]'>$2000</td>
                    </tr>
                  </tfoot>
                </table>
                <div>LIVE WAGERS</div>
              </div>
            </div>
          </div>
        </div>
      )}
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
      {format === 'single' && (
        <Revolver
          ref={revolverRefHandle}
          disabled={disabled || !(state === 'preparation')}
          beforeSlot={<>{showClick && <Click />}</>}
        />
      )}
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
          image={gameOverImage}
          hideBlood={settings.blood}
        />
      )}
      <Footer />
    </>
  )
}

export { Game }
