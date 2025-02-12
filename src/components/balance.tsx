import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

const Balance = ({
  value,
  beforeSlot,
}: {
  value: number
  beforeSlot?: React.ReactNode
}) => {
  const textRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef(value)

  useEffect(() => {
    const domText = textRef.current

    if (domText === null) {
      return
    }

    const prevVal = valueRef.current
    valueRef.current = value

    if (prevVal === value) {
      domText.textContent = `${value}`
      return
    }

    let currentValue = prevVal

    const TIME_FRAME = 16
    const TOTAL_TIME = 400
    const COUNT = TOTAL_TIME / TIME_FRAME

    const delta = value - currentValue
    const sign = delta > 0 ? 1 : -1

    const intervalValue = (delta / COUNT) ^ 0 || sign

    const add = () => {
      domText.textContent = `${(currentValue += intervalValue)}`
      if (currentValue * sign >= value * sign) {
        domText.textContent = `${value}`
        return
      }
      requestID = requestAnimationFrame(add)
    }

    let requestID = requestAnimationFrame(add)

    return () => {
      domText.textContent = `${value}`
      cancelAnimationFrame(requestID)
    }
  }, [value])

  return (
    <div className='flex gap-1'>
      {beforeSlot}
      <div className='flex flex-col'>
        <div className='text-center text-2xl leading-[1] tracking-tight text-[#006100] uppercase'>
          Balance
        </div>
        <div
          ref={textRef}
          className={cn(
            'fill-mode-both text-center text-3xl leading-[1] tracking-tight duration-500',
          )}
        ></div>
      </div>
    </div>
  )
}

export { Balance }
