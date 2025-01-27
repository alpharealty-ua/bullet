import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'

import { useAppContext } from '@/context/use-app-context'
import { multipliers } from '@/utils/constants'
import { randomIntFromInterval } from '@/utils/libs'
import { BetForm } from './bet-form'
import { GameOver } from './game-over'
import { PullButton } from './pull-button'
import { Revolver } from './revolver'
import { Offer } from './offer'
import { Click } from './click'
import { playAudio } from './audios'

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
  } = useAppContext()
  const [rotate, setRotate] = useState(15)

  const startGame = () => {
    setState('start-game')
    const oneCircle = 360
    const spinAmount = oneCircle * randomIntFromInterval(1, 4)
    setRotate((p) => p + spinAmount)
    playAudio('sound')
    setTimeout(() => {
      setState('pull-start')
    }, 2000)
  }

  const reset = () => {
    setBet(0)
    setTotal(1075)
    setCountBullet(5)
  }

  const betFn = () => {
    setState('bet')
    setCountBullet(5)
  }

  const multiplier = () => {
    setState('multiplier')

    playAudio('spin')
    const interval = 150
    const TIME_AUDIO = 2.2

    let count = (TIME_AUDIO * (1000 / interval)) ^ 0

    let index = 0
    const id = setInterval(() => {
      const newIndex = index++ % multipliers.length
      setActiveMultiplierIndex(newIndex)
      if (--count <= 0) {
        clearInterval(id)
        setTimeout(() => {
          setState('next')
        }, 1000)
      }
    }, interval)
  }

  const next = () => {
    setRotate((p) => p + 60)
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
    playAudio('gunshot')
    setTimeout(() => {
      setState('game-over')
    }, 100)
    setTimeout(() => {
      playAudio('drumbeat')
    }, 1000)
  }

  const handleBet = (form: HTMLFormElement, bet: number) => {
    const notHasMoney = bet > total
    if (notHasMoney) {
      alert('Not enough money')
      return
    }

    setBet(bet)
    setTotal((p) => p - bet)

    startGame()

    form.reset()
  }

  const handlePull = () => {
    mouseClick()
    setTimeout(() => {
      if (state === 'pull-start') {
        multiplier()
        return
      }
      setState('next')
    }, 1000)
  }

  const mouseClick = useCallback(() => {
    playAudio('mouseClick')
  }, [])

  const handleDeal = useCallback(() => {
    mouseClick()
    setTotal((p) => p + bet + 100)
    setState('bet')
  }, [mouseClick, bet])

  const handleNoDeal = useCallback(() => {
    mouseClick()
    setState('pull-next')
  }, [mouseClick])

  useEffect(() => {
    if (state === 'reset') {
      reset()
      return
    }
    if (state === 'bet') {
      betFn()
      return
    }
    if (state === 'start-game') {
      startGame()
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
      {state === 'bet' && <BetForm onSubmit={handleBet} />}
      {state === 'offer' && (
        <Offer onDeal={handleDeal} onNoDeal={handleNoDeal} />
      )}
      <Revolver
        beforeSlot={state === 'offer' && <Click />}
        className={classNames(
          state === 'start-game' && 'duration-2000',
          state === 'next' && 'duration-1000',
        )}
        style={{ transform: `rotate(${rotate}deg)` }}
      />
      {state !== 'bet' && (
        <PullButton
          disabled={!(state === 'pull-next' || state === 'pull-start')}
          onClick={handlePull}
        />
      )}
      {state === 'game-over' && <GameOver />}
    </>
  )
}

export { Game as States }
