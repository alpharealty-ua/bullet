import { useAppContext } from '@/context/use-app-context'
import { images, multipliers } from '@/lib/constants'
import { Bet } from './bet'
import { Bullets } from './bullets'
import { Multiplier } from './multiplier'

const Footer = () => {
  const { countBullet, activeMultiplierIndex, total, setBet } = useAppContext()

  return (
    <footer
      className='relative flex h-[74px] overflow-hidden bg-cover bg-[center_top] px-2 py-0.5'
      style={{ backgroundImage: `url(${images.bottomLine})` }}
    >
      <div className='flex w-[120px] shrink-0 justify-center'>
        <Bet balance={total} onBet={setBet} />
      </div>
      <Bullets countBullet={countBullet} />
      <div className='relative w-[120px] shrink-0'>
        <Multiplier items={multipliers} activeIndex={activeMultiplierIndex} />
        <button
          className='absolute right-1 bottom-1 h-[20px] w-[20px] cursor-pointer bg-contain bg-center'
          style={{ backgroundImage: `url(${images.settings})` }}
        ></button>
      </div>
    </footer>
  )
}

export { Footer }
