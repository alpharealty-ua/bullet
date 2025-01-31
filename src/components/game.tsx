import { useEffect, useRef, useState } from 'react'

import { useAppContext } from '@/context/use-app-context'
import { images, INIT_TOTAL, multipliers, State } from '@/lib/constants'
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

let i = 0

const Game = () => {
  const {
    state,
    setState,
    countBullet,
    setCountBullet,
    total,
    setTotal,
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

  const spinRevolver = () => {
    const oneCircle = 360
    const spinAmount = oneCircle * randomIntFromInterval(1, 4)
    playAudio('revolverspin')
    setTimeout(() => setRotate((rotateRef.current += spinAmount)), 10) // timeout for change rotate after render
  }

  const reset = () => {
    setState('reset')
    setBet(0)
    setTotal(INIT_TOTAL)
    setCountBullet(5)
  }

  const initGame = () => {
    setState('init-game')
    setCountBullet(5)
    spinRevolver()
    setTimeout(() => {
      setState('bet')
    }, 3000)
  }

  const cover = () => {
    setState('cover')
  }

  const rules = () => {
    setState('rules')
  }

  const betFn = () => {
    setState('bet')
    setCountBullet(5)
  }

  const multiplier = () => {
    setState('multiplier')
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
          setState('next')
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

    if (random === 1) {
      setTimeout(() => {
        gameOver()
      }, 1000)
      return
    }
    setTimeout(() => {
      if (newCountBullet < 0) {
        const win = multipliers[activeMultiplierIndex] * bet
        setTotal((p) => p + win)
        setState('bet')
        alert(`you won - ${win}$`)
        return
      }
      offer()
    }, 900)
  }

  const offer = () => {
    setState('offer')
  }

  const gameOver = () => {
    const image = new Image()
    const imageSrc = `${images.gameOver}?v=${i++}`
    image.src = imageSrc
    image.addEventListener('load', () => {
      setImageSrc(imageSrc)
      playAudio('gunshot')
      setState('game-over')
      setTimeout(() => {
        playAudio('drumbeat')
      }, 900)
    })
  }

  const handlePullStart = () => {
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

      setState('next')
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
      setTotal((p) => p + bet + 100)
      setBet(0)
      setState('bet')
      setDisabled(false)
    }, 500)
  }

  const handleCloseRules = () => {
    setDisabled(true)
    mouseClick()

    setTimeout(() => {
      cover()
      setDisabled(false)
    }, 200)
  }

  const handleCloseSettings = () => {
    setDisabled(true)
    mouseClick()

    setTimeout(() => {
      betFn()
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

  const handleTimeout = () => {
    betFn()
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
          <Cover onPull={handlePullStart} onGameRules={handleGameRules} />
        </Modal>
      )}
      {state === 'rules' && (
        <Modal onClose={handleCloseRules}>
          <Rules />
        </Modal>
      )}
      {state === 'settings' && (
        <Modal onClose={handleCloseSettings}>
          <Settings />
        </Modal>
      )}
      {state === 'add-money' && (
        <Modal onClose={handleCloseSettings}>
          <AddMoney
            total={total}
            disabled={disabled}
            onAddMoney={(money) => setTotal((p) => p + money)}
          />
        </Modal>
      )}
      {!(
        state === 'cover' ||
        state === 'rules' ||
        state === 'settings' ||
        state === 'add-money'
      ) && <Header />}
      {state === 'offer' && <Offer />}
      {!(
        state === 'cover' ||
        state === 'rules' ||
        state === 'settings' ||
        state === 'add-money'
      ) && (
        <Revolver
          className={cn(state === 'next' && 'duration-1000')}
          disabled={disabled || state !== 'bet'}
          style={{ transform: `rotate(${rotate}deg)` }}
          beforeSlot={state === 'offer' && <Click />}
        />
      )}
      <div
        className={cn(
          'mx-4 mt-auto mb-4 flex h-[100px] items-center justify-between',
          settings.invertButtons && 'flex-row-reverse',
        )}
      >
        <div>
          {state === 'offer' && (
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
              disabled={disabled || state === 'next' || bet === 0}
              className='animate-in fade-in-0 mt-auto duration-200'
              onClick={handlePull}
            />
          )}
        </div>
      </div>
      {state === 'game-over' && (
        <GameOver
          onClick={handleStartGame}
          onTimeout={handleTimeout}
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
