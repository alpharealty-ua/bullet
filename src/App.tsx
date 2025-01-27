import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { Multipler } from './components/multiplier'
import { BetForm } from './components/bet-form'
import { randomIntFromInterval } from './utils/libs'
import { multipliers, srcImages, State } from './utils/constants'
import { AppContext } from './context'
import { Debug } from './components/debug'

const audios = {
  sound: './assets/audios/sound.mp3',
  trigger: './assets/audios/trigger.wav',
  spin: './assets/audios/spin.mp3',
  gunshot: './assets/audios/gunshot.mp3',
  drumbeat: './assets/audios/drumbeat.wav',
  mouseClick: './assets/audios/mouse-click.mp3',
}

const audiosArray = Object.values(audios)

const playAudio = (src: string) => {
  const audios = document.getElementById('audios')

  if (audios === null) {
    return
  }

  const selector = `.audio-${audiosArray.findIndex((el) => el === src)}`

  const audio = audios.querySelector(selector) as HTMLAudioElement

  if (audio === null) {
    return
  }

  audio.play()
}

const App = () => {
  const [countBullet, setCountBullet] = useState(5)
  const [state, setState] = useState<State>('bet')
  const [bet, setBet] = useState<number>(100)
  const [total, setTotal] = useState(1075)
  const [rotate, setRotate] = useState(15)
  const [activeMultiplierIndex, setActiveMultiplierIndex] = useState(1)

  const startGame = () => {
    setState('start-game')
    setRotate((p) => p + 360 * randomIntFromInterval(1, 4))
    playAudio(audios.sound)
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
    setCountBullet(5)
  }

  const multiplier = () => {
    setState('multiplier')

    const generateMultiplier = () => {
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

    generateMultiplier()
    playAudio(audios.spin)
  }

  const next = () => {
    setRotate((p) => p + 60)
    playAudio(audios.trigger)
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
      if (newCountBullet === -1) {
        setTotal((p) => p + multipliers[activeMultiplierIndex] * bet)
        setState('bet')
        alert('you won')
        return
      }
      offer()
    }, 900)
  }

  const offer = () => {
    setState('offer')
  }

  const gameOver = () => {
    playAudio(audios.gunshot)
    setTimeout(() => {
      setState('game-over')
    }, 100)
    setTimeout(() => {
      playAudio(audios.drumbeat)
    }, 1000)
  }

  const handleBet = (bet: number) => {
    const notHasMoney = bet > total
    if (notHasMoney) {
      alert('Not enough money')
      return false
    }

    setBet(bet)
    setTotal((p) => p - bet)

    startGame()

    return true
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
    playAudio(audios.mouseClick)
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

  useEffect(() => {
    const srcImages = ['./assets/videos/game-over.gif']

    srcImages.forEach((src) => {
      const image = new Image()
      image.src = src

      image.addEventListener('load', () => {
        console.log(image)
        console.log('load')
      })
    })
  }, [])

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      <div className='relative flex justify-between flex-col max-w-[405px] mx-auto bg-[url(/assets/images/wrapper.jpg)] h-[733px] '>
        <div id='audios'>
          {audiosArray.map((src, i) => (
            <audio key={i} src={src} className={`audio-${i}`}></audio>
          ))}
        </div>

        <Debug />

        {state === 'game-over' && (
          <div className='absolute inset-0 z-50'>
            <div className='absolute inset-0 animate-game-over'>
              <img src='./assets/videos/game-over.gif' alt='' />
            </div>
            <div className='absolute inset-0 bg-[url(/assets/images/blood.png)] animate-blood'>
              <div className='absolute top-[130px] left-[105px] w-[143px] h-[143px] bg-[url(/assets/images/you.png)] bg-contain bg-center animate-blood-you'></div>
              <div className='absolute top-[450px] left-[210px] w-[158px] h-[153px] bg-[url(/assets/images/died.png)] bg-contain bg-center animate-blood-died'></div>
            </div>
          </div>
        )}

        <div className='flex justify-between py-2 px-3'>
          <div className='cursor-pointer w-[141px] h-[46px] bg-[url(/assets/images/logo.png)] bg-contain bg-center'></div>
          <div className='flex flex-col '>
            <div
              className='uppercase text-[#006100] text-[30px] leading-[1] tracking-tight
'
            >
              Balance
            </div>
            <div className='text-[40px] uppercase leading-[1] tracking-tight'>
              ${total}
            </div>
          </div>
        </div>
        {state === 'bet' && <BetForm onSubmit={handleBet} />}
        {state === 'offer' && (
          <div className='flex justify-between px-6 relative z-3 pt-3'>
            <div className='text-[40px] leading-[.8] text-right animate-offer-text font-bold pt-2'>
              the banker <div className='relative left-6'>offers...</div>
            </div>
            <div className='flex flex-col'>
              <div className='animate-offer-money h-[76px]'>
                <img src='./assets/images/100.png' alt='' />
              </div>
              <button
                className='relative cursor-pointer w-[120px] h-[86px] bg-[url(/assets/images/deal.png)] bg-cover ml-auto mt-auto disabled:opacity-50 disabled:cursor-not-allowed animate-offer-deal active:scale-75 transition-transform'
                onMouseDown={handleDeal}
              ></button>
              <button
                className='relative cursor-pointer w-[120px] h-[86px] bg-[url(/assets/images/no-deal.png)] bg-cover ml-auto mt-auto disabled:opacity-50 disabled:cursor-not-allowed animate-offer-no-deal active:scale-75 transition-transform'
                onMouseDown={handleNoDeal}
              ></button>
            </div>
          </div>
        )}

        <div className='w-[251px] h-[472px] mx-auto absolute bottom-8 left-0 right-0'>
          {state === 'offer' && (
            <>
              <div className='absolute left-[-55px] top-[75px] text-[52px] font-bold tracking-wide -rotate-[32deg] animate-click'>
                click!
              </div>
              <div className='absolute right-[-40px] top-[65px] text-[52px] font-bold tracking-wider rotate-[32deg] animate-click'>
                click!
              </div>
            </>
          )}
          <div
            className={classNames(
              'absolute top-[85px] left-[-8px] right-[-8px] aspect-square bg-[url(/assets/images/bullet-chambe.png)] bg-contain bg-no-repeat bg-center transition-transform duration-500',
              state === 'start-game' && 'duration-2000',
              state === 'next' && 'duration-1000',
            )}
            style={{ transform: `rotate(${rotate}deg)` }}
          ></div>
          <div className='absolute inset-0 bg-[url(/assets/images/body.png)] bg-contain bg-no-repeat bg-center'></div>
        </div>
        {state !== 'bet' && (
          <div className='flex items-center justify-between mt-auto mb-4 mx-4 animate-pull'>
            <button
              disabled={!(state === 'pull-next' || state === 'pull-start')}
              className='relative cursor-pointer w-[92px] h-[77px] bg-[url(/assets/images/pull.png)] bg-cover ml-auto mt-auto disabled:opacity-50 disabled:cursor-not-allowed active:scale-75 transition-transform'
              onClick={handlePull}
            ></button>
          </div>
        )}
        <div className='relative flex items-center  h-[74px] bg-[url(/assets/images/bottom-line.jpg)] bg-[-20px_top]  py-1 px-1'>
          <div className='flex flex-col gap-1'>
            <button className='cursor-pointer w-[17px] h-[17px] bg-[url(/assets/images/settings.png)] bg-cover'></button>
            <div className='w-[29px] h-[42px] bg-[url(/assets/images/bag.png)] bg-contain bg-center bg-no-repeat'></div>
          </div>
          <div className='flex flex-col text-center items-center min-w-[75px]'>
            <div className='text-[#ff0b0b] text-5xl leading-[1] font-black'>
              {bet}
            </div>
            <div className='text-[#006100] uppercase font-bold w-[42px] h-[14px] bg-[url(/assets/images/bet.png)] bg-cover'>
              {/* Bet */}
            </div>
          </div>
          <div className='flex gap-1.5 ml-auto mr-auto'>
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className={classNames(
                    'w-[22px] h-[32px] bg-[url(/assets/images/bullet.png)] bg-cover',
                    5 - index > countBullet && 'opacity-60',
                  )}
                ></div>
              ))}
          </div>
          <div
            className={classNames(
              'flex flex-col text-center opacity-0',
              state !== 'reset' &&
                state !== 'start-game' &&
                state !== 'bet' &&
                state !== 'pull-start' &&
                'opacity-100',
            )}
          >
            <div className='text-[#ff0b0b] text-5xl leading-[1] font-black relative text-center w-[100px]'>
              &nbsp;
              <Multipler
                items={multipliers}
                activeIndex={activeMultiplierIndex}
              />
            </div>
            <div className='text-[#006100] uppercase font-bold w-[86px] h-[16px] bg-[url(/assets/images/multiplier.png)] bg-cover'></div>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default App
