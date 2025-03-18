import { useMemo } from 'react'
import { cn, formatNumber } from '@/lib/utils'
import { useIncreaseNumber } from '@/hooks/use-increase-number'

const Balance = ({
  value,
  increaseTime = 500,
}: {
  value: number
  increaseTime?: number
}) => {
  // TODO: MAYBE TRANSFORM TO COMPONENT
  const { totalRef, winRef } = useIncreaseNumber({
    value,
    increaseTime,
    decreaseTime: 500,
    formatValue: formatNumber,
  })

  const formatedValue = useMemo(() => formatNumber(value), [value])

  const length = String(formatedValue).length

  // TODO: REFACTOR
  const fontSize =
    length > 14
      ? 'text-xs'
      : length > 12
        ? 'text-sm'
        : length > 10
          ? 'text-md'
          : length > 8
            ? 'text-lg'
            : length > 6
              ? 'text-xl'
              : ''

  return (
    <>
      <div
        ref={totalRef}
        title={formatedValue}
        className={cn(
          'relative max-w-40 text-2xl !leading-[1] tracking-tight opacity-100',
          fontSize,
        )}
      >
        <span className='opacity-0'>${formatedValue}</span>
        <div className={cn('absolute top-0 left-0 flex w-full')}>
          $<div data-value className='overflow-hidden'></div>
        </div>
      </div>
      <div
        ref={winRef}
        className={cn(
          'absolute top-full right-0 left-0 hidden justify-end text-center text-2xl leading-[1] tracking-tight',
          'fill-mode-both duration-500',
          '[&.is-in]:animate-in [&.is-in]:fade-in [&.is-in]:slide-in-from-bottom-10 [&.is-in]:flex [&.is-in]:delay-200',
          '[&.is-out]:animate-out [&.is-out]:fade-out [&.is-out]:flex',
          '[&.is-increase]:text-green',
          '[&.is-decrease]:text-red',
          fontSize,
        )}
      >
        <div className='hidden font-bold [.is-increase_&]:block'>+</div>
        <div className='hidden font-bold [.is-decrease_&]:block'>-</div>
        <div>$</div>
        <div data-value></div>
      </div>
    </>
  )
}

export { Balance }
