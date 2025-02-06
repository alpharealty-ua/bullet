import { useEffect, useRef, useState } from 'react'

import { useAppContext } from '@/context/use-app-context'
import { images, INIT_BALANCE, multipliers, State } from '@/lib/constants'
import { randomIntFromInterval, cn } from '@/lib/utils'
import { GameOver } from './game-over'
import { PullButton } from './pull-button'
import { Revolver } from './revolver'
import { Offer } from './offer'
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
    setTotal,
    addTotal,
    bet,
    setBet,
    activeMultiplierIndex,
    setActiveMultiplierIndex,
    playAudio,
    settings,
  } = useAppContext()
  const [rotate, setRotate] = useState(15)
  const rotateRef = useRef(rotate)
  const [disabled, setDisabled] = useState(false)
  const [imageSrc, setImageSrc] = useState(images.gameOver)
  const isJackpot = activeMultiplierIndex === 5

  const spinRevolver = () => {
    const oneCircle = 360
    const spinAmount = oneCircle * randomIntFromInterval(1, 4)
    playAudio('revolverspin')
    requestAnimationFrame(() => {
      setRotate((rotateRef.current += spinAmount))
    })
  }

  const reset = () => {
    changeState('reset')
    setBet(0)
    setTotal(INIT_BALANCE)
    setCountBullet(5)
  }

  const initGame = () => {
    changeState('init-game')
    setCountBullet(5)
    spinRevolver()
    setTimeout(() => {
      changeState('bet')
    }, 1500)
  }

  const cover = () => {
    changeState('cover')
  }

  const rules = () => {
    changeState('rules')
  }

  const betFn = () => {
    changeState('bet')
    setCountBullet(5)
  }

  const multiplier = () => {
    changeState('multiplier')
    setDisabled(true)

    playAudio('spin')
    const interval = randomIntFromInterval(100, 300)
    const TIME_AUDIO = 2.8

    let count = (TIME_AUDIO * (1000 / interval)) ^ 0

    let index = 0
    const id = setInterval(() => {
      const newIndex = index++ % multipliers.length
      setActiveMultiplierIndex(newIndex)
      if (--count <= 0) {
        clearInterval(id)
        setTimeout(() => {
          changeState('next')
          setDisabled(false)
        }, 1000)
      }
    }, interval)
  }

  const next = () => {
    setRotate((rotateRef.current += 60))
    playAudio('trigger')

    const random = randomIntFromInterval(1, 3)

    const newCountBullet = countBullet - 1
    setCountBullet(newCountBullet)

    if (random === 1 && !isJackpot) {
      setTimeout(() => {
        gameOver()
      }, 1000)
      return
    }
    setTimeout(() => {
      if (newCountBullet < 0) {
        const win = multipliers[activeMultiplierIndex] * bet
        addTotal(win)
        changeState('bet')
        return
      }
      offer()
    }, 900)
  }

  const offer = () => {
    changeState('offer')
    if (isJackpot) {
      setDisabled(true)
      setTimeout(() => {
        const win = 100_000
        addTotal(win)
        changeState('bet')
        setDisabled(false)
      }, 3000)
    }
  }

  const gameOver = () => {
    const image = new Image()
    const imageSrc = `${images.gameOver}?v=${gifCacheIndex++}`
    image.src = imageSrc
    image.addEventListener('load', () => {
      setImageSrc(imageSrc)
      playAudio('gunshot')
      addTotal(-bet)
      setBet(0)
      changeState('game-over')
      setTimeout(() => {
        playAudio('drumbeat')
      }, 900)
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
    mouseClick()
    setTimeout(() => {
      if (state === 'pull-start') {
        multiplier()
        setDisabled(false)

        return
      }

      changeState('next')
      setDisabled(false)
    }, 1000)
  }

  const mouseClick = () => {
    playAudio('mouseClick')
  }

  const handleDeal = () => {
    setDisabled(true)
    mouseClick()
    setTimeout(() => {
      addTotal(100)
      setBet(0)
      changeState('bet')
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
      betFn()
      setDisabled(false)
    }, 200)
  }

  const handleGameOverTimeout = () => {
    betFn()
  }

  const handleAddMoney = () => {
    changeState('add-money')
  }

  useEffect(() => {
    // TODO: REFACTOR
    if (state === 'reset') {
      reset()
      return
    }
    if (state === 'cover') {
      cover()
      return
    }
    if (state === 'rules') {
      rules()
      return
    }
    if (state === 'init-game') {
      initGame()
      return
    }
    if (state === 'bet') {
      betFn()
      return
    }
    if (state === 'multiplier') {
      multiplier()
      return
    }
    if (state === 'next') {
      next()
      return
    }
    if (state === 'offer') {
      offer()
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
      {state === 'offer' && isJackpot && (
        <div className='flex flex-col items-center gap-2'>
          <div className='animate-in fade-in zoom-in-50 fill-mode-both origin-top text-center text-3xl delay-500 duration-500'>
            Jackpot
          </div>
          <div className='animate-in fade-in fill-mode-both max-w-[300px] delay-1000 duration-1000'>
            <img src={images['100000$']} alt='' />
          </div>
        </div>
      )}
      {state === 'offer' && !isJackpot && <Offer />}
      {state === 'bet' && balance === 0 && (
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
          className={cn(state === 'next' && 'duration-1000')}
          disabled={disabled || !(state === 'bet' || state === 'pull-start')}
          style={{ transform: `rotate(${rotate}deg)` }}
          beforeSlot={<>{state === 'offer' && <Click />}</>}
        />
      )}
      <div
        className={cn(
          'mx-4 mt-auto mb-4 flex h-[100px] items-center justify-between',
          settings.invertButtons && 'flex-row-reverse',
        )}
      >
        <div>
          {state === 'offer' && !isJackpot && (
            <div className='animate-in fade-in fill-mode-both relative -top-1 mt-auto delay-[1200ms] duration-1000'>
              <DealButton disabled={disabled} onClick={handleDeal} />
            </div>
          )}
        </div>
        <div>
          {!(
            [
              'cover',
              'rules',
              'settings',
              'init-game',
              'add-money',
              'bet',
            ] satisfies State[] as State[]
          ).includes(state) && (
            <PullButton
              disabled={
                disabled ||
                state === 'next' ||
                (state === 'pull-start' && bet === 0)
              }
              className='animate-in fade-in-0 mt-auto duration-200'
              onClick={handlePull}
            />
          )}
        </div>
      </div>
      {state === 'game-over' && (
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
