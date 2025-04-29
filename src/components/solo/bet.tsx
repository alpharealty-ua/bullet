import { useCallback, useEffect, useRef, useState } from 'react'

import { IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface BetProps {
  maxBet?: number
  bet?: number
  onBet?: (bet: number) => void
  disabled?: boolean
  topButtonSlot?: (value: number) => React.ReactNode
  bottomSlot?: (value: number) => React.ReactNode
  size?: 'sm' | 'md'
}

const Bet = ({
  bet = 50,
  maxBet = 1000,
  onBet,
  disabled = false,
  topButtonSlot,
  bottomSlot,
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

    const sliderWrapperEl = sliderWrapperRef.current

    if (sliderWrapperEl === null) {
      return
    }

    sliderWrapperEl.ondragstart = () => false

    const sliderEl = sliderWrapperEl.querySelector(
      '[data-slider]',
    ) as HTMLDivElement
    const buttonEl = sliderWrapperEl.querySelector(
      '[data-button]',
    ) as HTMLButtonElement
    const valueEls = sliderWrapperEl.querySelectorAll('[data-value]')

    if (sliderEl === null || buttonEl === null) {
      return
    }

    const pointerDown = (event: PointerEvent) => {
      buttonEl.setPointerCapture(event.pointerId)

      const startX = event.clientX
      // @ts-ignore
      const startY = event.clientY

      // getBoundingClientRect more accurate than offsetleft
      const sliderDomRect = sliderEl.getBoundingClientRect()
      const buttonDomRect = buttonEl.getBoundingClientRect()
      const shiftTranslateX = buttonDomRect.width / 2
      const startLeft =
        buttonDomRect.left - sliderDomRect.left + shiftTranslateX
      const width = sliderWrapperEl.offsetWidth

      let percentX = Math.round((startLeft / width) * 100)

      const pointerMove = (event: PointerEvent) => {
        const currentX = event.clientX
        const deltaX = currentX - startX

        const newX = deltaX + startLeft
        const boundaryRoundNewX = Math.min(Math.max(0, newX), width)

        percentX = (boundaryRoundNewX / width) * 100

        const ROUND_BET = 100
        const BET_IN_ONE_PERCENT = maxBet / 100
        const ROUND_PERCENT = ROUND_BET / BET_IN_ONE_PERCENT

        const roundPercentX = (percentX =
          Math.round(percentX / ROUND_PERCENT) * ROUND_PERCENT)
        const currentBet = Math.min(
          Math.round((maxBet * roundPercentX) / 100),
          maxBet,
        )

        buttonEl.style.left = roundPercentX + '%'
        valueEls.forEach(
          (valueDom) => (valueDom.textContent = String(currentBet)),
        )
      }

      const pointerUp = (_: PointerEvent) => {
        changeValue((maxBet * percentX) / 100)

        buttonEl.removeEventListener('pointermove', pointerMove)
        buttonEl.removeEventListener('pointerup', pointerUp)
      }

      buttonEl.addEventListener('pointermove', pointerMove)
      buttonEl.addEventListener('pointerup', pointerUp)
    }

    buttonEl.addEventListener('pointerdown', pointerDown)

    return () => {
      buttonEl.removeEventListener('pointerdown', pointerDown)
    }
  }, [maxBet, onBet, disabled, changeValue])

  const handleSliderClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (disabled) {
      return
    }

    const buttonEl = sliderWrapperRef.current?.querySelector(
      '[data-button]',
    ) as HTMLButtonElement

    if (buttonEl === null) {
      return
    }

    const buttomDomRect = buttonEl.getBoundingClientRect()

    if (buttonEl === null) {
      return
    }

    const clientX = event.clientX
    const clickInTheRight = buttomDomRect.left < clientX
    const sign = clickInTheRight ? 1 : -1

    const INCREMENT_BET = 100
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

    const sliderEl = sliderWrapperRef.current?.querySelector(
      '[data-slider]',
    ) as HTMLDivElement

    if (sliderEl == null) {
      return
    }

    const { x, width } = sliderEl.getBoundingClientRect()

    const clickX = event.clientX
    const sliderX = x
    const clickRelativeSliderX = clickX - sliderX

    const percentX = (clickRelativeSliderX / width) * 100

    const ROUND_BET = 100
    const roundedBet =
      Math.round((maxBet * percentX) / 100 / ROUND_BET) * ROUND_BET

    changeValue(roundedBet)
  }

  const handleMaxBetClick = () => {
    changeValue(maxBet)
  }

  return (
    <div
      ref={sliderWrapperRef}
      className='relative -mt-1.5 flex w-full flex-col text-center'
    >
      <div className='relative z-[3] -my-4'>
        <div
          className={cn('h-14 bg-contain bg-center bg-no-repeat')}
          style={{ backgroundImage: `url(${IMAGES.sliderbar})` }}
        ></div>
        <div
          className={cn(
            'absolute inset-0 top-0 right-2 left-2 cursor-pointer',
            disabled && 'cursor-not-allowed',
          )}
          onClick={handleSliderClick}
          onDoubleClick={handleSliderDbClick}
          data-slider
        >
          <button
            className={cn(
              'absolute top-1/2 left-0 z-[3] h-10 w-10 -translate-1/2 cursor-pointer touch-none rounded-full bg-contain bg-center bg-no-repeat disabled:cursor-not-allowed',
            )}
            disabled={disabled}
            style={{
              left: `${percent}%`,
            }}
            data-button
          >
            <span
              className={cn(
                'bg-red absolute inset-0 m-auto rounded-[inherit]',
                size === 'sm' && 'h-2/4 w-2/4',
              )}
            ></span>
            <>
              {topButtonSlot && (
                <div className='absolute bottom-full left-1/2 w-20 -translate-x-1/2 text-xs uppercase'>
                  {topButtonSlot(value)}
                </div>
              )}
            </>
          </button>
        </div>
        <div
          className={cn(
            'text-red absolute top-1/2 left-full flex -translate-y-1/2 justify-between uppercase',
          )}
        >
          <button
            className={cn(
              'absolute top-1/2 left-1/2 -translate-1/2 rotate-90 cursor-pointer pb-2 text-lg disabled:cursor-not-allowed',
              size === 'sm' && 'text-sm',
            )}
            onClick={handleMaxBetClick}
            disabled={disabled}
          >
            Max
          </button>
        </div>
      </div>

      {bottomSlot ? (
        bottomSlot(value)
      ) : (
        <div className='grow px-3 text-right text-2xl leading-[1] text-ellipsis'>
          $<span data-value>{value}</span>
        </div>
      )}
    </div>
  )
}

export { Bet }
