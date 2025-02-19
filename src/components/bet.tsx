import { useCallback, useEffect, useRef, useState } from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface BetProps {
  maxBet?: number
  bet?: number
  onBet?: (bet: number) => void
  disabled?: boolean
  valueInBottom?: boolean
  size?: 'sm' | 'md'
}

const Bet = ({
  bet = 50,
  maxBet = 1000,
  onBet,
  disabled = false,
  valueInBottom = false,
  size = 'md',
}: BetProps) => {
  const sliderWrapperRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(bet)
  const [percent, setPercent] = useState(0)

  const changeValue = useCallback(
    (bet: number, callOnBet = true) => {
      bet = Math.max(0, Math.min(Math.round(bet), maxBet))
      const percent = Math.max(0, Math.min((bet / maxBet) * 100, 100))
      callOnBet && onBet && onBet(bet)
      setValue(bet)
      setPercent(Math.min(percent, 100))
    },
    [onBet, maxBet],
  )

  useEffect(() => {
    const currentBet = Math.min(bet, maxBet)

    changeValue(currentBet, false)
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
    const valueDoms = sliderWrapperDom.querySelectorAll('[data-value]')

    if (sliderDom === null || buttonDom === null) {
      return
    }

    const pointerDown = (event: PointerEvent) => {
      buttonDom.setPointerCapture(event.pointerId)

      const startX = event.clientX
      // @ts-ignore
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

        const ROUND_BET = 10
        const BET_IN_ONE_PERCENT = maxBet / 100
        const ROUND_PERCENT = ROUND_BET / BET_IN_ONE_PERCENT

        const roundPercentX = (percentX =
          Math.round(percentX / ROUND_PERCENT) * ROUND_PERCENT)
        const currentBet = Math.min(
          Math.round((maxBet * roundPercentX) / 100),
          maxBet,
        )

        buttonDom.style.left = roundPercentX + '%'
        valueDoms.forEach(
          (valueDom) => (valueDom.textContent = String(currentBet)),
        )
      }

      const pointerUp = (_: PointerEvent) => {
        changeValue((maxBet * percentX) / 100)

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

    const INCREMENT_BET = 50
    const currentBet = value
    const addedBet = currentBet + INCREMENT_BET * sign
    const roundAddedBet = Math.floor(addedBet / INCREMENT_BET) * INCREMENT_BET

    const newBet = Math.max(0, Math.min(roundAddedBet, maxBet))

    changeValue(newBet)
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

    const { x, width } = sliderDom.getBoundingClientRect()

    const clickX = event.clientX
    const sliderX = x
    const clickRelativeSliderX = clickX - sliderX

    const percentX = (clickRelativeSliderX / width) * 100

    const ROUND_BET = 50
    const roundedBet =
      Math.round((maxBet * percentX) / 100 / ROUND_BET) * ROUND_BET

    changeValue(roundedBet)
  }

  return (
    <div
      ref={sliderWrapperRef}
      className='relative -mt-1.5 flex w-full flex-col text-center'
    >
      <div className='relative z-[3]'>
        <div
          className={cn(
            'aspect-[1/0.15] cursor-pointer bg-contain bg-center bg-no-repeat',
            disabled && 'cursor-not-allowed',
          )}
          style={{ backgroundImage: `url(${images.sliderbar})` }}
          onClick={handleSliderClick}
          onDoubleClick={handleSliderDbClick}
          data-slider
        ></div>
        <button
          className={cn(
            'absolute top-1/2 left-0 z-[3] h-6 w-6 -translate-1/2 cursor-pointer touch-none bg-contain bg-center bg-no-repeat',
            disabled && 'cursor-not-allowed',
            size === 'sm' && 'h-4 w-4',
          )}
          style={{
            backgroundImage: `url(${images.bullet})`,
            left: `${percent}%`,
          }}
          data-button
        >
          {/* TODO: TEMPORARY SOLUTION  */}
          {!valueInBottom && (
            <>
              <div className='absolute bottom-full left-1/2 w-20 -translate-x-1/2 text-xs uppercase'>
                <div>Risk</div>
                $1000
              </div>
              <div className='absolute top-full left-1/2 w-20 -translate-x-1/2 text-xs uppercase'>
                <div>To win</div>$<span data-value>{value}</span>
              </div>
            </>
          )}
        </button>
      </div>
      <div
        className={cn(
          'text-red absolute -top-3.5 right-0 left-0 flex justify-between uppercase',
          size === 'sm' && 'text-xs',
        )}
      >
        <div>0</div>
        <div>Max</div>
      </div>
      {valueInBottom && (
        <div className='w-full text-2xl leading-[1] text-ellipsis'>
          $<span data-value>{value}</span>
        </div>
      )}
    </div>
  )
}

export { Bet }
