import { useEffect, useRef } from 'react'

import { images } from '@/lib/constants'
import { formatBet } from '@/lib/utils'

const Bet = ({
  balance,
  onBet,
}: {
  balance: number
  onBet: (bet: number) => void
}) => {
  const sliderWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sliderWrapperDom = sliderWrapperRef.current

    if (sliderWrapperDom === null) {
      return
    }

    const sliderDom = sliderWrapperDom.querySelector(
      '[data-slider]',
    ) as HTMLButtonElement
    const buttonDom = sliderWrapperDom.querySelector(
      '[data-button]',
    ) as HTMLButtonElement
    const valueDom = sliderWrapperDom.querySelector('[data-value]')

    if (sliderDom === null || buttonDom === null || valueDom === null) {
      return
    }

    let bet = 0

    const changePercentAndBet = (percent: number, needChangeState = true) => {
      buttonDom.style.left = percent + '%'

      bet = ((balance * percent) / 100) ^ 0
      valueDom.textContent = formatBet(bet)
      if (needChangeState) {
        onBet(bet)
      }
    }

    const sliderClick = (event: MouseEvent) => {
      const x = event.clientX
      const { left, width } = sliderDom.getBoundingClientRect()

      const newXInPercent = ((x - left) / width) * 100

      changePercentAndBet(newXInPercent)
    }

    sliderDom.addEventListener('click', sliderClick)

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
      sliderDom.removeEventListener('click', sliderClick)
      buttonDom.removeEventListener('pointerdown', pointerDown)
    }
  }, [balance, onBet])

  return (
    <div className='flex w-full flex-col items-center text-center'>
      <div className='bg-center text-lg font-bold text-[#006100] uppercase'>
        Bet
      </div>
      <div ref={sliderWrapperRef} className='relative flex w-full flex-col'>
        <div className='relative'>
          <div
            className='aspect-[1/0.15] bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${images.slider})` }}
            data-slider
          ></div>
          <button
            className='absolute top-1/2 left-0 z-[3] h-4 w-4 -translate-1/2 cursor-pointer touch-none bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${images.bullet})` }}
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
          0
        </div>
      </div>
    </div>
  )
}

export { Bet }
