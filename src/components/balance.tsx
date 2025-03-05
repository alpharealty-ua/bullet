import { ComponentProps, useEffect, useMemo, useState } from 'react'
import { cn, formatNumber } from '@/lib/utils'
import { useIncreaseNumber } from '@/hooks/use-increase-number'

const Balance = ({
  value,
  increaseTime = 500,
}: {
  value: number
  increaseTime?: number
  beforeSlot?: React.ReactNode
}) => {
  // TODO: MAYBE TRANSFORM TO COMPONENT
  const { totalRef, winRef } = useIncreaseNumber({
    value,
    increaseTime,
    decreaseTime: 500,
    formatValue: formatNumber,
    // TODO:  ADDED DELAY
  })

  const length = String(formatNumber(value)).length

  const formatedValue = useMemo(() => formatNumber(value), [value])

  return (
    <div className='relative flex flex-col overflow-hidden'>
      <div className='text-green text-center text-2xl leading-[1] tracking-tight uppercase'>
        Balance
      </div>
      <div
        ref={totalRef}
        className={cn(
          'relative text-center text-2xl !leading-[1] tracking-tight opacity-100',
          length > 6 && 'text-xl',
          length > 8 && 'text-lg',
          length > 10 && 'text-sm',
        )}
      >
        <span className='opacity-0'>${formatedValue}</span>
        <div className={cn('absolute top-0 left-0 flex w-full')}>
          $<div data-value></div>
        </div>
      </div>
      <div
        ref={winRef}
        className={cn(
          'absolute top-full right-0 left-0 hidden justify-center text-center text-3xl leading-[1] tracking-tight',
          'fill-mode-both duration-500',
          '[&.is-in]:animate-in [&.is-in]:fade-in [&.is-in]:slide-in-from-bottom-10 [&.is-in]:flex [&.is-in]:delay-200',
          '[&.is-out]:animate-out [&.is-out]:fade-out [&.is-out]:flex',
          '[&.is-increase]:text-green',
          '[&.is-decrease]:text-red',
        )}
      >
        <div className='hidden font-bold [.is-increase_&]:block'>+</div>
        <div className='hidden font-bold [.is-decrease_&]:block'>-</div>
        <div>$</div>
        <div data-value></div>
      </div>
    </div>
  )
}

const BalanceWithDelay = ({
  hasDelay,
  value,
  ...props
}: ComponentProps<typeof Balance> & { hasDelay: boolean }) => {
  const [balanceWithDelay, setBalanceWithDelay] = useState(value)

  useEffect(() => {
    if (value === balanceWithDelay) {
      return
    }

    const changeBalance = () => setBalanceWithDelay(value)

    if (!hasDelay) {
      changeBalance()
      return
    }

    // TODO: ADD SUBSCRIPT WINSOUND
    const timeoutID = setTimeout(changeBalance, 1000)

    return () => {
      clearTimeout(timeoutID)
    }
  }, [value, hasDelay, balanceWithDelay])

  return <Balance {...props} value={balanceWithDelay} />
}

export { Balance, BalanceWithDelay }
