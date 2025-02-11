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
import { GameOver } from './game-over'
import { PullButton } from './pull-button'
import { Revolver } from './revolver'
import { Result } from './result'
import { Click } from './click'
import { DealButton } from './deal-button'
import { Rules } from './rules'
import { Cover } from './cover'
import { Header } from './header'
import { Footer } from './footer'
import { Debug } from './debug'
import { Modal } from './modal'
import { Settings } from './settings'
import { AddMoney } from './add-money'

let gifCacheIndex = Math.random()

const Game = () => {
  const {
    state,
    changeState,
    undoState,
    countBullet,
    setCountBullet,
    balance,
    addTotal,
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
  const [rotate, setRotate] = useState(15)
  const revolverRef = useRef<HTMLDivElement>(null)
  const rotateRef = useRef(rotate)
  const [disabled, setDisabled] = useState(false)
  const disabledRef = useRef(disabled)
  const [imageSrc, setImageSrc] = useState('')

  const jackpot = bet * getMultiplierValueByIndex(activeMultiplierIndex)
  const nodeRef = useRef(null)
  const nodeRef2 = useRef(null)
  const [showResult, setShowResult] = useState(false)
  const [offer, setOffer] = useState(1)
  const hasOffer =
    getMultiplierValueByIndex(activeMultiplierIndex) >= 10 && Boolean(offer)

  const newGame = () => {
    const hasPrevBet = bet !== 0
    const prevBet = hasPrevBet ? (bet > balance ? balance : bet) : 0

    changeState('pull')
    setBet(prevBet)
    setOffer(0)
    setShowResult(false)
    setCountBullet(5)
    setActiveMultiplierIndex(-1)
    setImageSrc('')
  }

  const getMultiplier = async (): Promise<void> => {
    const chambeDom = revolverRef.current?.querySelector(
      '[data-chambe]',
    ) as HTMLDivElement

    if (chambeDom === null) {
      return
    }

    await playAudio('spin')
    const AMOUNT_CHAMBER = randomIntFromInterval(6, 18)
    const DURATION = 1500
    const interval = DURATION / AMOUNT_CHAMBER

    chambeDom.style.transitionDuration = `${interval}ms`

    let count = AMOUNT_CHAMBER
    let index = 0

    return new Promise<void>((resolve) => {
      // TODO: REFACTOR
      const animateFn = () => {
        const transitionEnd = (event: TransitionEvent) => {
          if (event.propertyName !== 'rotate') {
            return
          }

          const newIndex = index++ % multipliers.length
          setActiveMultiplierIndex(newIndex)
          animateFn()
        }

        if (count-- > 0) {
          chambeDom?.addEventListener('transitionend', transitionEnd, {
            once: true,
          })
          chambeDom.style.rotate = (rotateRef.current += 60) + 'deg'
        } else {
          chambeDom.style.transitionDuration = ``
          setRotate(rotateRef.current)
          resolve()
        }
      }

      animateFn()
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
      addTotal(offer + bet)
      setOffer(0)
    }
    newGame()
  }

  const next = async () => {
    if (!hasMultiplier) {
      await getMultiplier()
      addTotal(-bet)
      setOffer(0)
      setShowResult(true)

      return
    }

    const audio = await playAudio('trigger')

    if (audio === null) {
      return
    }

    setOffer(0)
    setShowResult(false)
    setRotate((rotateRef.current += 60))

    const random = randomIntFromInterval(1, 4)

    const newCountBullet = countBullet - 1
    setCountBullet(newCountBullet)

    return new Promise<void>((resolve) => {
      const result = async () => {
        if (random === -1) {
          await gameOver()
          resolve()
          return
        }
        if (newCountBullet < 0) {
          const win =
            getMultiplierValueByIndex(activeMultiplierIndex) * bet + bet
          addTotal(win)
          newGame()
          resolve()
          return
        }
        // TODO: add state for click animation
        setOffer(100)
        setShowResult(true)
        resolve()
      }

      audio.addEventListener('ended', result, { once: true })
    })
  }

  const gameOver = async () => {
    const image = new Image()
    const imageSrc = `${images.gameOver}?v=${gifCacheIndex++}`
    image.src = imageSrc

    const gameOverOnLoadImage = async () => {
      await playAudio('gunshot')
      const DURATION_GUNSHOT_AUDIO = 1000
      const DELAY = -100
      const DURATION = DURATION_GUNSHOT_AUDIO + DELAY

      setTimeout(() => {
        playAudio('drumbeat')
      }, DURATION)

      setImageSrc(imageSrc)
      changeState('game-over')
    }

    image.addEventListener('load', gameOverOnLoadImage, { once: true })
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
    await callWithAnimation(next)
  }

  const mouseClick = async () => {
    const audio = await playAudio('mouseClick')

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
    await mouseClick()

    setTimeout(() => {
      undoState()
      setDisabled(false)
    }, 200)
  }

  const handleStartGame = async () => {
    setDisabled(true)
    await mouseClick()

    setTimeout(() => {
      newGame()
      setDisabled(false)
    }, 200)
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
      {state === 'cover' && (
        <Modal className='items-center justify-center gap-6' hideHeader>
          <Cover onPull={handeInitGame} onGameRules={handleGameRules} />
        </Modal>
      )}
      {state === 'rules' && (
        <Modal onClose={handleCloseModal}>
          <Rules />
        </Modal>
      )}
      {state === 'settings' && (
        <Modal onClose={handleCloseModal}>
          <Settings />
        </Modal>
      )}
      {state === 'add-money' && (
        <Modal onClose={handleCloseModal}>
          <AddMoney total={balance} disabled={disabled} onAddMoney={addTotal} />
        </Modal>
      )}
      {!(
        state === 'cover' ||
        state === 'rules' ||
        state === 'settings' ||
        state === 'add-money'
      ) && <Header />}

      <Result
        topText={'Jackpot'}
        bottomText={offer ? 'the banker offers...' : ''}
        price={`$${jackpot}`}
        offer={offer ? `$${offer}` : ''}
        open={showResult}
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
      {!(
        state === 'cover' ||
        state === 'rules' ||
        state === 'settings' ||
        state === 'add-money'
      ) && (
        <Revolver
          ref={revolverRef}
          disabled={disabled || hasMultiplier}
          style={{ rotate: `${rotate}deg` }}
          beforeSlot={<>{Boolean(offer) && <Click />}</>}
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
            in={hasOffer}
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
                  <DealButton disabled={disabled} onClick={handleDeal} />
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
                        open && 'animate-in fade-in slide-in-from-top-4',
                        close && 'animate-out fade-out slide-out-to-top-4',
                      )}
                      style={{ backgroundImage: `url(${images.startgame})` }}
                    ></div>
                  )
                }}
              </CSSTransition>
              <PullButton
                disabled={disabled || bet === 0}
                className='animate-in fade-in-0 mt-auto duration-200'
                onClick={handlePull}
              />
            </>
          )}
        </div>
      </div>
      {state === 'game-over' && imageSrc && (
        <GameOver
          onClick={handleStartGame}
          onTimeout={handleGameOverTimeout}
          timeout={2000}
          image={imageSrc}
          hideBlood={settings.blood}
        />
      )}
      {!(
        state === 'cover' ||
        state === 'rules' ||
        state === 'settings' ||
        state === 'add-money'
      ) && <Footer />}
    </>
  )
}

export { Game }
