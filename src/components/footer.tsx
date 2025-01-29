import { useEffect, useState } from 'react'
import classNames from 'classnames'

import { useAppContext } from '@/context/use-app-context'
import { images, multipliers } from '@/lib/constants'
import { Bet } from './bet'
import { Bullets } from './bullets'
import { Multiplier } from './multiplier'

const formatBet = (value: number) => {
  if (value >= 1000) return ((value / 100) ^ 0) / 10 + 'K'
  return String(value)
}

const Footer = () => {
  const { bet, countBullet, activeMultiplierIndex, total, state } =
    useAppContext()
  const [hasMoney, setHasMoney] = useState(true)
  const [clickedWallet, setClicketWallet] = useState(false)

  const handleAddMoney = () => {
    setClicketWallet(true)
  }

  useEffect(() => {
    setHasMoney(total > 0)
    if (!(total > 0)) {
      setClicketWallet(false)
    }
  }, [total])

  return (
    <footer
      className='relative flex h-[74px] items-center overflow-hidden bg-[-20px_top] px-1 py-1'
      style={{ backgroundImage: `url(${images.bottomLine})` }}
    >
      <div className='flex w-[120px] shrink-0 items-center'>
        <div className='flex flex-col items-center gap-2'>
          <button
            className='h-[17px] w-[17px] cursor-pointer bg-cover'
            style={{ backgroundImage: `url(${images.settings})` }}
          ></button>
          <button
            className={classNames(
              'h-[30px] w-[30px] cursor-pointer bg-contain bg-center bg-no-repeat',
              !hasMoney &&
                !clickedWallet &&
                state === 'bet' &&
                'repeat-infinite animate-[wiggle] duration-1000 ease-linear',
            )}
            style={{ backgroundImage: `url(${images.money})` }}
            onClick={handleAddMoney}
          ></button>
        </div>
        <Bet value={formatBet(bet)} />
      </div>
      <Bullets countBullet={countBullet} />
      <div className='w-[120px] shrink-0'>
        <Multiplier items={multipliers} activeIndex={activeMultiplierIndex} />
      </div>
    </footer>
  )
}

export { Footer }
