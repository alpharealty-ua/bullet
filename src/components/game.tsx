import { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { useAppContext } from '@/context/use-app-context'
import {
  getMultiplierValueByIndex,
  images,
  multipliers,
  State,
} from '@/lib/constants'
import { randomIntFromInterval, cn } from '@/lib/utils'
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
import { Modal } from './modal'
import { Settings } from './settings'
import { AddMoney } from './add-money'

const Game = () => {
  const {
    state,
    changeState,
    undoState,
    countBullet,
    setCountBullet,
    balance,
    addBalance,
    bet,
    setBet,
    activeMultiplierIndex,
    hasMultiplier,
    setActiveMultiplierIndex,
    playAudio,
    showHelpers,
    setShowHelpers,
    settings,
  } = useAppContext()
  const revolverRefHandle = useRef<{
    spin: (interval: number) => Promise<void>
  }>(null)
  const [disabled, setDisabled] = useState(false)
  const disabledRef = useRef(disabled)

  const jackpot = bet * getMultiplierValueByIndex(activeMultiplierIndex)
  const nodeRef = useRef(null)
  const nodeRef2 = useRef(null)
  // TODO: EXTRACT ALL STATE IN CONTEXT
  const [offer, setOffer] = useState(1)
  const [showJackpot, setShowJackpot] = useState(false)
  const [showOffer, setShowOffer] = useState(false)
  const [showClick, setShowClick] = useState(false)

  // TODO: EXTRACT GAME LOGIC IN CONTEXT
  const newGame = () => {
    const hasPrevBet = bet !== 0
    const prevBet = hasPrevBet ? (bet > balance ? balance : bet) : 0

    changeState('pull')
    setBet(prevBet)
    setOffer(0)
    setCountBullet(5)
    setActiveMultiplierIndex(-1)
    setShowJackpot(false)
    setShowOffer(false)
  }

  const getMultiplier = async (): Promise<number> => {
    const revolverHandle = revolverRefHandle.current

    if (revolverHandle === null) {
      return -1
    }

    const AMOUNT_CHAMBER = randomIntFromInterval(6, 18)
    const DURATION = 1500
    const interval = DURATION / AMOUNT_CHAMBER

    let count = AMOUNT_CHAMBER
    let index = 0

    await playAudio('spin')

    return new Promise<number>((resolve) => {
      const spin = async () => {
        if (count-- > 0) {
          await revolverHandle.spin(interval)
          const newIndex = index++ % multipliers.length
          setActiveMultiplierIndex(newIndex)
          spin()
        } else {
          resolve(index)
        }
      }

      spin()
    })
  }

  const callWithAnimation = async <T,>(callback: () => T | Promise<T>) => {
    const disabled = disabledRef.current
    disabledRef.current = true

    if (disabled) {
      return
    }

    const BTN_TRANSITION_DURATION = 200
    setTimeout(() => {
      if (disabledRef.current) {
        setDisabled(true)
      }
    }, BTN_TRANSITION_DURATION)
    await mouseClick()

    const result = await callback()

    setDisabled(false)
    disabledRef.current = false
    return result
  }

  const deal = () => {
    if (offer > 0) {
      addBalance(offer + bet)
      setOffer(0)
    }
    newGame()
  }

  const next = async () => {
    if (!hasMultiplier) {
      setShowJackpot(false)
      addBalance(-bet)
      await getMultiplier()
      setOffer(0)
      setShowJackpot(true)

      return
    }

    const revolverHandle = revolverRefHandle.current

    if (revolverHandle === null) {
      return
    }

    setOffer(0)
    setShowJackpot(true)
    setShowOffer(false)

    const random = randomIntFromInterval(1, 6)
    const newCountBullet = countBullet - 1

    const isGameOver = random === 1
    const isWin = !isGameOver && newCountBullet === 0

    setCountBullet(newCountBullet)
    setShowClick(false)

    await playAudio('triggerpull')
    await revolverHandle.spin(200)

    setShowClick(true)

    if (isGameOver) {
      await gameOver()
      return
    }
    if (isWin) {
      await playAudio('chaching')
      const win = getMultiplierValueByIndex(activeMultiplierIndex) * bet
      addBalance(win)
      newGame()
      return
    }
    setOffer(100)
    setShowOffer(true)
  }

  useEffect(() => {
    const image = new Image()
    const imageSrc = `${images.gameover}`
    image.src = imageSrc
  }, [])

  const gameOver = async () => {
    await playAudio('gunshot')
    const DURATION_GUNSHOT_AUDIO = 1000
    const DELAY = -100
    const DURATION = DURATION_GUNSHOT_AUDIO + DELAY

    setTimeout(() => {
      playAudio('drumbeat')
    }, DURATION)
    changeState('game-over')
  }

  const handeInitGame = async () => {
    await mouseClick()
    setDisabled(true)
    newGame()
    setDisabled(false)
  }

  const handleGameRules = async () => {
    await mouseClick()
    setDisabled(true)
    changeState('rules')
    setDisabled(false)
  }

  const handlePull = async () => {
    setShowHelpers(false)
    setShowOffer(false)
    await callWithAnimation(next)
  }

  const mouseClick = async () => {
    const audio = await playAudio('mouseclick')

    if (audio === null) {
      return
    }

    return new Promise((resolve) => {
      audio.addEventListener('ended', resolve, { once: true })
    })
  }

  const handleDeal = async () => {
    await callWithAnimation(deal)
  }

  const handleCloseModal = async () => {
    setDisabled(true)
    mouseClick()

    undoState()
    setDisabled(false)
  }

  const handleStartGame = async () => {
    setDisabled(true)
    mouseClick()

    newGame()
    setDisabled(false)
  }

  const handleGameOverTimeout = () => {
    newGame()
  }

  const handleAddMoney = () => {
    changeState('add-money')
  }

  useEffect(() => {
    // TODO: REFACTOR
    if (state === 'game-over') {
      gameOver()
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <>
      <Debug disabled={disabled} />
      {/* TODO: EXTRACT MODALS */}
      <Modal
        onClose={handleCloseModal}
        className='items-center justify-center gap-6'
        open={state === 'cover'}
        hideHeader
      >
        <Cover onPull={handeInitGame} onGameRules={handleGameRules} />
      </Modal>
      <Modal onClose={handleCloseModal} open={state === 'rules'}>
        <Rules />
      </Modal>
      <Modal onClose={handleCloseModal} open={state === 'settings'}>
        <Settings />
      </Modal>
      <Modal onClose={handleCloseModal} open={state === 'add-money'}>
        <AddMoney
          balance={balance}
          disabled={disabled}
          onAddMoney={addBalance}
        />
      </Modal>
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
      {state === 'pull' && !hasMultiplier && balance === 0 && (
        <div className='relative flex justify-center pt-[50px]'>
          <button
            className='relative inline-flex transition-transform active:scale-75 disabled:scale-100 disabled:cursor-not-allowed'
            onClick={handleAddMoney}
          >
            <span className='absolute inset-0 inline-flex cursor-pointer items-center justify-center text-3xl font-bold'>
              Add money
            </span>
            <svg
              width='283'
              height='76'
              viewBox='0 0 283 76'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M2 4H274.635L271.975 72L7.31971 69.5L2 4Z'
                fill='#FF9B2A'
              />
              <path
                d='M3.9165 2.99121C92.8331 2.99121 181.777 3.32183 270.71 3.32183'
                stroke='#010101'
                strokeWidth='3'
                strokeLinecap='round'
              />
              <path
                d='M2 70.1064C66.7996 70.1064 131.686 69.7845 196.477 70.1432C224.878 70.3004 252.707 72.7513 281 72.7513'
                stroke='#010101'
                strokeWidth='3'
                strokeLinecap='round'
              />
              <path
                d='M274.196 4.31445C271.539 26.64 270.709 48.7701 270.709 71.0989'
                stroke='#010101'
                strokeWidth='3'
                strokeLinecap='round'
              />
              <path
                d='M2.17705 2C2.17705 12.8361 2.01187 23.6745 2.17705 34.5106C2.24502 38.9693 4.11033 43.3621 4.59893 47.8087C5.72803 58.0844 4.79268 63.4157 4.79268 73.7029'
                stroke='#010101'
                strokeWidth='3'
                strokeLinecap='round'
              />
            </svg>
          </button>
        </div>
      )}
      <Revolver
        ref={revolverRefHandle}
        disabled={disabled || hasMultiplier}
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
                    image='deal'
                    onClick={handleDeal}
                  />
                </div>
              )
            }}
          </CSSTransition>
        </div>
        <div className='relative'>
          {!(
            [
              'cover',
              'rules',
              'settings',
              'add-money',
            ] satisfies State[] as State[]
          ).includes(state) && (
            <>
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
                        'fill-mode-both absolute right-0 bottom-full aspect-[1/0.5] w-[75px] origin-top bg-contain bg-center bg-no-repeat duration-400',
                        open &&
                          'animate-in fade-in slide-in-from-top-4 delay-400',
                        close && 'animate-out fade-out slide-out-to-top-4',
                      )}
                      style={{ backgroundImage: `url(${images.startgame})` }}
                    ></div>
                  )
                }}
              </CSSTransition>
              <Button
                disabled={disabled || bet === 0}
                className='animate-in fade-in-0 mt-auto duration-200'
                image='pull'
                onClick={handlePull}
              />
            </>
          )}
        </div>
      </div>
      {state === 'game-over' && (
        <GameOver
          onClick={handleStartGame}
          onTimeout={handleGameOverTimeout}
          timeout={2000}
          image={images.gameover}
          hideBlood={settings.blood}
        />
      )}
      <Footer />
    </>
  )
}

export { Game }
