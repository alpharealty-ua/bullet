import { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { useAppContext } from '@/context/use-app-context'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { getMultiplierValueByIndex, images, multipliers } from '@/lib/constants'
import { randomIntFromInterval, cn, wait } from '@/lib/utils'
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
    setActiveMultiplierIndex,
    playAudio,
    showHelpers,
    setShowHelpers,
    settings,
    offer,
    setOffer,
    showOffer,
    setShowOffer,
    showJackpot,
    setShowJackpot,
    showClick,
    setShowClick,
  } = useAppContext()
  const revolverRefHandle = useRef<{
    spin: (interval: number) => Promise<void>
  }>(null)
  // TODO: MOVE TO CONTEXT
  const [disabled, setDisabled] = useState(false)
  const disabledRef = useRef(disabled)

  const jackpot = bet * getMultiplierValueByIndex(activeMultiplierIndex)
  const nodeRef = useRef(null)
  const nodeRef2 = useRef(null)
  const modal = useCustomModal()

  // TODO: EXTRACT GAME LOGIC IN CONTEXT
  const newGame = () => {
    const hasPrevBet = bet !== 0
    const prevBet = hasPrevBet ? (bet > balance ? balance : bet) : 0

    changeState('preparation')
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

    const AMOUNT_CHAMBER = randomIntFromInterval(18, 30)
    const DURATION_AUDIO = 1500
    const interval = DURATION_AUDIO / AMOUNT_CHAMBER

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

  const deal = async () => {
    if (offer > 0) {
      await playAudio('chaching')
      addBalance(offer + bet)
      setOffer(0)
    }
    newGame()
  }

  const next = async () => {
    if (state === 'preparation') {
      setShowJackpot(false)
      addBalance(-bet)
      await getMultiplier()
      setOffer(0)
      setShowJackpot(true)
      changeState('running')

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
      await winGame()
      return
    }
    if (!settings.declineAllDeals) {
      setOffer(100)
      setShowOffer(true)
    }
  }

  useEffect(() => {
    const image = new Image()
    const imageSrc = `${images.gameover}`
    image.src = imageSrc
  }, [])

  const gameOver = async () => {
    const audio = await playAudio('gunshot')

    changeState('game-over')

    if (audio === null) {
      return
    }

    audio.addEventListener(
      'ended',
      () => {
        playAudio('drumbeat')
      },
      { once: true },
    )
  }

  const winGame = async () => {
    await playAudio('chaching')
    await wait(1000)
    const audio = await playAudio('winsound')

    changeState('win')

    // TODO: REMOVE 1000. ONLY FOR TEST
    addBalance(jackpot || 1000)

    if (audio === null) {
      newGame()
      return
    }

    return new Promise<void>((resolve) => {
      audio.addEventListener('ended', () => {
        newGame()
        resolve()
      })
    })
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
    modal.show({
      contentSlot: <Rules />,
    })
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

  const handleStartGame = async () => {
    setDisabled(true)
    await mouseClick()

    newGame()
    setDisabled(false)
  }

  const handleGameOverTimeout = () => {
    newGame()
  }

  const handleAddMoney = async () => {
    await mouseClick()
    modal.show({
      contentSlot: <AddMoney balance={balance} onAddMoney={addBalance} />,
    })
  }

  useEffect(() => {
    // TODO: REFACTOR
    if (state === 'game-over') {
      gameOver()
      return
    }
    if (state === 'win') {
      winGame()
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

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
