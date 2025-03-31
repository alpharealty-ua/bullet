import { useEffect, useState } from 'react'

import { getItem, removeItem, setItem } from '@/lib/localstorage'
import { addZerro, cn } from '@/lib/utils'
import { ADD_MONEY } from '@/lib/constants'
import { Balance } from '@/components/balance'

const AddMoney = ({
  balance,
  onAddMoney,
}: {
  balance: number
  onAddMoney: (money: number) => void
}) => {
  const [time, setTime] = useState('')
  const [endTime, setEndTime] = useState(Number(getItem('endTime') ?? 0))

  const handleClick = () => {
    const endDate = new Date()
    endDate.setHours(endDate.getHours() + 12)

    const endTime = endDate.getTime()

    setItem('endTime', String(endTime))
    setEndTime(endTime)
    onAddMoney(ADD_MONEY)
  }

  useEffect(() => {
    if (endTime === 0) {
      return
    }

    const tick = () => {
      const rangeTime = ((endTime - Date.now()) / 1000) ^ 0

      const hours = ((rangeTime % (24 * 60 * 60)) / (60 * 60)) ^ 0
      const minutes = ((rangeTime % (60 * 60)) / 60) ^ 0
      const seconds = rangeTime % 60

      setTime(`${hours}:${addZerro(minutes)}:${addZerro(seconds)}`)

      if (rangeTime <= 0) {
        removeItem('endTime')
        setEndTime(0)
      }
    }
    tick()
    const intervalId = setInterval(tick, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [endTime])

  return (
    <div className='flex items-center justify-between'>
      <div className='relative flex flex-col items-end'>
        <div className='text-green text-center text-2xl leading-[1] tracking-tight uppercase'>
          Balance
        </div>
        <Balance value={balance} />
      </div>
      {/* TODO: ADD BUTTON WITH AUDIO  */}
      <button
        className={cn(
          'relative inline-flex cursor-pointer transition-transform active:scale-75 disabled:scale-100 disabled:cursor-not-allowed',
          endTime && 'cursor-not-allowed',
        )}
        disabled={Boolean(endTime)}
        onClick={handleClick}
      >
        <span className='absolute inset-0 inline-flex items-center justify-center text-lg uppercase'>
          {endTime ? time : `add $${ADD_MONEY}`}
        </span>
        <svg
          width='110'
          height='76'
          viewBox='0 0 110 76'
          fill='none'
          className={cn(endTime && 'text-[#ccc]', !endTime && 'text-primary')}
        >
          <path
            d='M2.14062 4.1084H104.641L103.641 72.1084L4.14062 69.6084L2.14062 4.1084Z'
            fill='currentColor'
          />
          <path
            d='M2.72656 2.99121C36.4439 2.99121 70.1713 3.32183 103.895 3.32183'
            stroke='#010101'
            strokeWidth='3'
            strokeLinecap='round'
          />
          <path
            d='M2 70.1064C26.5721 70.1064 51.177 69.7845 75.7458 70.1432C86.5157 70.3004 97.0684 72.7513 107.797 72.7513'
            stroke='#010101'
            strokeWidth='3'
            strokeLinecap='round'
          />
          <path
            d='M105.217 4.31445C104.21 26.64 103.895 48.7701 103.895 71.0989'
            stroke='#010101'
            strokeWidth='3'
            strokeLinecap='round'
          />
          <path
            d='M2.0669 2C2.0669 12.8361 2.00426 23.6745 2.0669 34.5106C2.09267 38.9693 2.8 43.3621 2.98528 47.8087C3.41343 58.0844 3.05875 63.4157 3.05875 73.7029'
            stroke='#010101'
            strokeWidth='3'
            strokeLinecap='round'
          />
        </svg>
      </button>
    </div>
  )
}

export { AddMoney }
