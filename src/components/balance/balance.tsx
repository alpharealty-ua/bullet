import { useMemo } from 'react'

import { useBalance } from '@/api/wallet.api'
import { useIncreaseBalance } from '@/components/balance/use-increase-balance'
import { useGameStore } from '@/store/game.store'
import { cn, formatNumber } from '@/lib/utils'

const Balance = () => {
  const { data: balance } = useBalance()
  const increaseTime = useGameStore(({ increaseTime }) => increaseTime)
  const { totalElRef, addedElRef } = useIncreaseBalance({
    value: balance,
    increaseTime,
    decreaseTime: 500,
    formatValue: formatNumber,
  })

  const formatedValue = useMemo(() => formatNumber(balance), [balance])

  const valueLength = String(formatedValue).length

  const fontSize = ((
    [
      [14, 'text-xs'],
      [12, 'text-sm'],
      [10, 'text-md'],
      [8, 'text-lg'],
      [6, 'text-xl'],
    ] as const
  ).find(([length]) => valueLength > length) ?? [0, ''])[1]

  return (
    <>
      <div
        ref={totalElRef}
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
        ref={addedElRef}
        className={cn(
          'invisible absolute top-full right-0 left-0 flex justify-end text-center text-2xl leading-[1] tracking-tight',
          'fill-mode-both [&.is-animate]:visible [&.is-animate]:duration-500',
          '[&.is-in]:animate-in [&.is-in]:fade-in [&.is-in]:slide-in-from-bottom-10 [&.is-in]:visible [&.is-in]:delay-200',
          '[&.is-out]:animate-out [&.is-out]:fade-out',
          '[&.is-increase]:text-green',
          '[&.is-decrease]:text-red',
          fontSize,
        )}
      >
        <div className='font-bold' data-sign></div>
        <div>$</div>
        <div data-value></div>
      </div>
    </>
  )
}

export { Balance }
