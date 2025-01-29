import { useEffect, useState } from 'react'
import classNames from 'classnames'

import { useAppContext } from '@/context/use-app-context'
import { multipliers } from '@/lib/constants'
import { Bet } from './bet'
import { Bullets } from './bullets'
import { Multiplier } from './multiplier'

const formatBet = (value: number) => {
  if (value >= 1000) return ((value / 100) ^ 0) / 10 + 'K'
  return String(value)
}

const Footer = () => {
  const { bet, countBullet, activeMultiplierIndex, total } = useAppContext()
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
    <footer className='relative flex h-[74px] items-center overflow-hidden bg-[url(/assets/images/bottom-line.jpg)] bg-[-20px_top] px-1 py-1'>
      <div className='flex w-[120px] shrink-0 items-center'>
        <div className='flex flex-col items-center'>
          <button className='h-[17px] w-[17px] cursor-pointer bg-[url(/assets/images/settings.png)] bg-cover'></button>
          <button
            className={classNames(
              '-mt-1 -mb-1 h-[50px] w-[40px] cursor-pointer bg-[url(/assets/images/money.svg)] bg-contain bg-center bg-no-repeat',
              !hasMoney &&
                !clickedWallet &&
                'repeat-infinite animate-[wiggle] delay-[1000ms] duration-1000 ease-linear',
            )}
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
