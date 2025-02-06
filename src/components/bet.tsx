import { useCallback, useEffect, useRef, useState } from 'react'

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
  const [value, setValue] = useState(formatBet(bet))
  const [percent, setPercent] = useState(0)

  const changeValue = useCallback(
    (bet: number, percent: number, callOnBet = true) => {
      callOnBet && onBet(bet)
      setValue(formatBet(bet))
      setPercent(percent)
    },
    [onBet],
  )

  useEffect(() => {
    const currentBet = Math.min(bet, MAX_BET)
    const newXInPercent = (bet / maxBet) * 100

    changeValue(currentBet, newXInPercent, false)
  }, [maxBet, bet, changeValue])

  useEffect(() => {
    if (disabled) {
      return
    }

    const sliderWrapperDom = sliderWrapperRef.current

    if (sliderWrapperDom === null) {
      return
    }

    sliderWrapperDom.ondragstart = () => false

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

    const pointerDown = (event: PointerEvent) => {
      buttonDom.setPointerCapture(event.pointerId)

      const startX = event.clientX
      const startY = event.clientY

      // getBoundingClientRect more accurate than offsetleft
      const sliderDomRect = sliderDom.getBoundingClientRect()
      const buttonDomRect = buttonDom.getBoundingClientRect()
      const shiftTranslateX = buttonDomRect.width / 2
      const startLeft =
        buttonDomRect.left - sliderDomRect.left + shiftTranslateX
      const width = sliderWrapperDom.offsetWidth

      let percentX = Math.round((startLeft / width) * 100)

      const pointerMove = (event: PointerEvent) => {
        const currentX = event.clientX
        const deltaX = currentX - startX

        const newX = deltaX + startLeft
        const boundaryRoundNewX = Math.min(Math.max(0, newX), width)

        percentX = (boundaryRoundNewX / width) * 100

        const ROUND_BET = 5
        const BET_IN_ONE_PERCENT = maxBet / 100
        const ROUND_PERCENT = ROUND_BET / BET_IN_ONE_PERCENT

        const roundPercentX = (percentX =
          Math.round(percentX / ROUND_PERCENT) * ROUND_PERCENT)
        const currentBet = Math.round((maxBet * roundPercentX) / 100)

        buttonDom.style.left = roundPercentX + '%'
        valueDom.textContent = formatBet(currentBet)
      }

      const pointerUp = (_: PointerEvent) => {
        const currentBet = ((maxBet * percentX) / 100) ^ 0
        changeValue(currentBet, percentX)

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
  }, [maxBet, onBet, disabled, changeValue])

  const handleSliderClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (disabled) {
      return
    }

    const sliderWrapperDom = sliderWrapperRef.current

    if (sliderWrapperDom === null) {
      return
    }

    const buttonDom = sliderWrapperDom.querySelector(
      '[data-button]',
    ) as HTMLButtonElement

    const buttomDomRect = buttonDom.getBoundingClientRect()

    if (buttonDom === null) {
      return
    }

    const clientX = event.clientX
    const clickInTheRight = buttomDomRect.left < clientX
    const sign = clickInTheRight ? 1 : -1

    const ADD_BET = 100
    const currentBet = bet
    const addedBet = currentBet + ADD_BET * sign
    const roundAddedBet = Math.floor(addedBet / ADD_BET) * ADD_BET

    const newBet = Math.min(roundAddedBet, MAX_BET)
    const percentX = (newBet / MAX_BET) * 100

    changeValue(newBet, percentX)
  }

  const handleSliderDbClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
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

    const { left, width } = sliderDom.getBoundingClientRect()

    const clientX = event.clientX
    const shiftX = left
    const deltaX = clientX - shiftX

    const ROUND_BET = 100
    const BET_IN_ONE_PERCENT = maxBet / 100
    const ROUND_PERCENT = ROUND_BET / BET_IN_ONE_PERCENT

    const newPercentX = (deltaX / width) * 100
    const newRoundPercentX =
      Math.round(newPercentX / ROUND_PERCENT) * ROUND_PERCENT

    const currentBet = ((maxBet * newRoundPercentX) / 100) ^ 0

    changeValue(currentBet, newRoundPercentX)
  }

  return (
    <div className='flex w-full flex-col items-center text-center'>
      <div className='bg-center text-lg font-bold text-[#006100] uppercase'>
        Bet
      </div>
      <div ref={sliderWrapperRef} className='relative flex w-full flex-col'>
        <div className='relative z-[3]'>
          <div
            className={cn(
              'aspect-[1/0.15] cursor-pointer bg-contain bg-center bg-no-repeat',
              disabled && 'cursor-not-allowed',
            )}
            style={{ backgroundImage: `url(${images.slider})` }}
            onClick={handleSliderClick}
            onDoubleClick={handleSliderDbClick}
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
        <div className='absolute -top-3.5 right-0 left-0 flex justify-between text-[12px] text-[#ff0b0b] uppercase'>
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
