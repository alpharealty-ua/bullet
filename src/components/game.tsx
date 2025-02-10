import { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { useAppContext } from '@/context/use-app-context'
import { images, multipliers, State } from '@/lib/constants'
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
    settings,
  } = useAppContext()
  const [rotate, setRotate] = useState(15)
  const rotateRef = useRef(rotate)
  const [disabled, setDisabled] = useState(false)
  const [imageSrc, setImageSrc] = useState('')
  const isFirstPull =
    state === 'pull' && !disabled && hasMultiplier && countBullet === 5
  const jackpot = bet * multipliers[activeMultiplierIndex]
  const [durationSpinRotate, setDurationSpinRotate] = useState('')
  const nodeRef = useRef(null)
  const [offer, setOffer] = useState(0)
  const hasOffer = multipliers[activeMultiplierIndex] >= 10 && Boolean(offer)

  const initGame = () => {
    changeState('pull')
    setBet(bet === 0 ? 0 : bet > balance ? balance : bet)
    setOffer(0)
    setCountBullet(5)
    setActiveMultiplierIndex(-1)
    setImageSrc('')
  }

  const cover = () => {
    changeState('cover')
  }

  const rules = () => {
    changeState('rules')
  }

  const multiplier = () => {
    setDurationSpinRotate('duration-1800')
    setDisabled(true)

    playAudio('spin')
    const AMOUNT_CHAMBER = randomIntFromInterval(6, 18)
    const DURATION = 1.7 * 1000
    const interval = DURATION / AMOUNT_CHAMBER
    setRotate((rotateRef.current += 60 * AMOUNT_CHAMBER))

    let count = DURATION / interval

    let index = 0
    let prev = -Infinity
    const animateFn = (timestamp: number) => {
      if (timestamp - prev < interval) {
        requestAnimationFrame(animateFn)
        return
      }
      prev = timestamp

      const newIndex = index++ % multipliers.length
      setActiveMultiplierIndex(newIndex)
      if (--count > 0) {
        requestAnimationFrame(animateFn)
      } else {
        setTimeout(() => {
          setDurationSpinRotate('')
          changeState('pull')
          setDisabled(false)
        }, 500)
      }
    }

    requestAnimationFrame(animateFn)
  }

  const next = () => {
    setRotate((rotateRef.current += 60))
    playAudio('trigger')

    const random = randomIntFromInterval(1, 5)

    const newCountBullet = countBullet - 1
    setCountBullet(newCountBullet)

    if (random === 1) {
      setTimeout(() => {
        gameOver()
      }, 1000)
      return
    }
    setTimeout(() => {
      if (newCountBullet < 0) {
        const win = multipliers[activeMultiplierIndex] * bet + bet
        addTotal(win)
        initGame()
        return
      }
      setOffer(100)
    }, 900)
  }

  const gameOver = () => {
    const image = new Image()
    const imageSrc = `${images.gameOver}?v=${gifCacheIndex++}`
    image.src = imageSrc
    image.addEventListener('load', () => {
      playAudio('gunshot').then(() => {
        setImageSrc(imageSrc)
        changeState('game-over')
        setTimeout(() => {
          playAudio('drumbeat')
        }, 900)
      })
    })
  }

  const handeInitGame = () => {
    setDisabled(true)
    mouseClick()

    setTimeout(() => {
      initGame()
      setDisabled(false)
    }, 500)
  }

  const handleGameRules = () => {
    setDisabled(true)
    mouseClick()

    setTimeout(() => {
      rules()
      setDisabled(false)
    }, 500)
  }

  const handlePull = () => {
    setDisabled(true)
    setOffer(0)
    mouseClick()

    setTimeout(() => {
      setDisabled(false)
      if (!hasMultiplier) {
        multiplier()
        addTotal(-bet)

        return
      }

      next()
    }, 1000)
  }

  const mouseClick = () => {
    playAudio('mouseClick')
  }

  const handleDeal = () => {
    setDisabled(true)
    mouseClick()
    setTimeout(() => {
      addTotal(offer + bet)
      initGame()
      setDisabled(false)
    }, 500)
  }

  const handleCloseModal = () => {
    setDisabled(true)
    mouseClick()

    setTimeout(() => {
      undoState()
      setDisabled(false)
    }, 200)
  }

  const handleStartGame = () => {
    setDisabled(true)
    mouseClick()

    setTimeout(() => {
      initGame()
      setDisabled(false)
    }, 200)
  }

  const handleGameOverTimeout = () => {
    initGame()
  }

  const handleAddMoney = () => {
    changeState('add-money')
  }

  useEffect(() => {
    // TODO: REFACTOR
    if (state === 'cover') {
      cover()
      return
    }
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
        bottomText={'the banker offers...'}
        price={`$${jackpot}`}
        open={isFirstPull}
      />

      <Result
        topText={'the banker offers...'}
        bottomText={''}
        price={'$100'}
        open={hasOffer}
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
          className={cn(durationSpinRotate)}
          disabled={disabled || hasMultiplier}
          style={{ transform: `rotate(${rotate}deg)` }}
          beforeSlot={<>{Boolean(offer) && <Click />}</>}
        />
      )}
      <div
        className={cn(
          'mx-4 mt-auto mb-4 flex h-[100px] items-center justify-between',
          settings.invertButtons && 'flex-row-reverse',
        )}
      >
        <div>
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
        <div>
          {!(
            [
              'cover',
              'rules',
              'settings',
              'add-money',
            ] satisfies State[] as State[]
          ).includes(state) && (
            <PullButton
              disabled={disabled || bet === 0}
              className='animate-in fade-in-0 mt-auto duration-200'
              onClick={handlePull}
            />
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
