import { useEffect, useRef, useState } from 'react'

import { images, MAX_BET } from '@/lib/constants'
import { cn, formatBet } from '@/lib/utils'

const Bet = ({
  bet,
  maxBet,
  onBet,
  disabled,
}: {
  maxBet: number
  bet: number
  onBet: (bet: number) => void
  disabled: boolean
}) => {
  const sliderWrapperRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(bet)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    setValue(bet)
    const currentBet = Math.min(bet, MAX_BET)
    const newXInPercent = (bet / maxBet) * 100

    onBet(currentBet)
    setValue(currentBet)
    setPercent(newXInPercent)
  }, [maxBet, onBet, bet])

  useEffect(() => {
    if (disabled) {
      return
    }

    const sliderWrapperDom = sliderWrapperRef.current

    if (sliderWrapperDom === null) {
      return
    }

    const sliderDom = sliderWrapperDom.querySelector(
      '[data-slider]',
    ) as HTMLDivElement
    const buttonDom = sliderWrapperDom.querySelector(
      '[data-button]',
    ) as HTMLButtonElement
    const valueDom = sliderWrapperDom.querySelector('[data-value]')

    if (sliderDom === null || buttonDom === null || valueDom === null) {
      return
    }

    let currentBet = 0

    const changePercentAndBet = (percent: number, needChangeState = true) => {
      buttonDom.style.left = percent + '%'

      currentBet = ((maxBet * percent) / 100) ^ 0
      valueDom.textContent = formatBet(currentBet)
      if (needChangeState) {
        onBet(currentBet)
        setValue(currentBet)
        setPercent(percent)
      }
    }

    const pointerDown = (event: PointerEvent) => {
      const startX = event.clientX
      const shiftX = buttonDom.offsetLeft
      const width = sliderWrapperDom.offsetWidth

      buttonDom.setPointerCapture(event.pointerId)

      let newXInPercent = parseInt(buttonDom.style.left) ?? 0

      const pointerMove = (event: PointerEvent) => {
        const endX = event.clientX
        const deltaX = endX - startX + shiftX

        const newX = Math.min(Math.max(0, deltaX), width)
        newXInPercent = (newX / width) * 100

        changePercentAndBet(newXInPercent, false)
      }

      const pointerUp = (_: PointerEvent) => {
        changePercentAndBet(newXInPercent)
        buttonDom.removeEventListener('pointermove', pointerMove)
        buttonDom.removeEventListener('pointerup', pointerUp)
      }

      buttonDom.addEventListener('pointermove', pointerMove)
      buttonDom.addEventListener('pointerup', pointerUp)
    }

    buttonDom.addEventListener('pointerdown', pointerDown)

    return () => {
      buttonDom.removeEventListener('pointerdown', pointerDown)
    }
  }, [maxBet, onBet, disabled])

  const handleSliderClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    // TODO: REPLACE ON IT LATER
    // {
    //   const currentBet = Math.min(bet + 50, MAX_BET)
    //   const newXInPercent = (value / maxBet) * 100

    //   onBet(currentBet)
    //   setValue(currentBet)
    //   setPercent(newXInPercent)

    //   return
    // }

    const sliderWrapperDom = sliderWrapperRef.current

    if (sliderWrapperDom === null) {
      return
    }

    const sliderDom = sliderWrapperDom.querySelector(
      '[data-slider]',
    ) as HTMLDivElement

    const x = event.clientX
    const { left, width } = sliderDom.getBoundingClientRect()

    const newXInPercent = ((x - left) / width) * 100
    const currentBet = ((maxBet * newXInPercent) / 100) ^ 0

    onBet(currentBet)
    setValue(currentBet)
    setPercent(newXInPercent)
  }

  return (
    <div className='flex w-full flex-col items-center text-center'>
      <div className='bg-center text-lg font-bold text-[#006100] uppercase'>
        Bet
      </div>
      <div ref={sliderWrapperRef} className='relative flex w-full flex-col'>
        <div className='relative'>
          <div
            className={cn('aspect-[1/0.15] bg-contain bg-center bg-no-repeat')}
            style={{ backgroundImage: `url(${images.slider})` }}
            onClick={handleSliderClick}
            data-slider
          ></div>
          <button
            className={cn(
              'absolute top-1/2 left-0 z-[3] h-4 w-4 -translate-1/2 cursor-pointer touch-none bg-contain bg-center bg-no-repeat',
              disabled && 'cursor-not-allowed',
            )}
            style={{
              backgroundImage: `url(${images.bullet})`,
              left: `${percent}%`,
            }}
            data-button
          ></button>
        </div>
        <div className='absolute top-[-10px] right-0 left-0 flex justify-between text-[12px] text-[#ff0b0b] uppercase'>
          <div>0</div>
          <div>Max</div>
        </div>
        <div
          className='w-full overflow-hidden text-3xl leading-[1] text-ellipsis'
          data-value
        >
          {value}
        </div>
      </div>
    </div>
  )
}

export { Bet }
