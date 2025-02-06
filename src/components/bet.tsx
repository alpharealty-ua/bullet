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

    let hasMove = false

    const pointerDown = (event: PointerEvent) => {
      hasMove = false
      const startX = event.clientX
      const shiftX = buttonDom.offsetLeft
      const width = sliderWrapperDom.offsetWidth

      buttonDom.setPointerCapture(event.pointerId)

      let percentX = (shiftX / width) * 100

      const pointerMove = (event: PointerEvent) => {
        hasMove = true
        const currentX = event.clientX
        const deltaX = currentX - startX

        const newX = Math.min(Math.max(0, deltaX + shiftX), width)
        percentX = (newX / width) * 100

        const currentBet = ((maxBet * percentX) / 100) ^ 0
        buttonDom.style.left = percentX + '%'
        valueDom.textContent = formatBet(currentBet)
      }

      const pointerUp = (_: PointerEvent) => {
        if (!hasMove) {
          const ADD_BET = 50
          const currentBet = ((maxBet * percentX) / 100) ^ 0

          const newBet = Math.min(
            currentBet + (ADD_BET - (currentBet % ADD_BET)),
            MAX_BET,
          )
          percentX = (newBet / MAX_BET) * 100
        }

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

    const sliderDom = sliderWrapperDom.querySelector(
      '[data-slider]',
    ) as HTMLDivElement

    const { left, width } = sliderDom.getBoundingClientRect()

    const clientX = event.clientX
    const shiftX = left
    const deltaX = clientX - shiftX

    const newXInPercent = deltaX / width
    const currentBet = (maxBet * newXInPercent) ^ 0

    changeValue(currentBet, newXInPercent)
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
            onDoubleClick={handleSliderClick}
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
