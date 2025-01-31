import { useEffect, useState } from 'react'

import { useAppContext } from '@/context/use-app-context'
import { images, multipliers } from '@/lib/constants'
import { Bet } from './bet'
import { Bullets } from './bullets'
import { Multiplier } from './multiplier'
import { WalletButtonAnimation } from './wallet-button-animation'

const formatBet = (value: number) => {
  if (value >= 1000) return ((value / 100) ^ 0) / 10 + 'K'
  return String(value)
}

const Footer = () => {
  const { bet, countBullet, activeMultiplierIndex } = useAppContext()

  return (
    <footer
      className='relative flex h-[74px] items-center overflow-hidden bg-cover bg-[center_top] px-1 py-0.5'
      style={{ backgroundImage: `url(${images.bottomLine})` }}
    >
      <div className='flex w-[120px] shrink-0 items-center'>
        <div className='flex flex-col items-center gap-2'>
          <WalletButtonAnimation />
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
