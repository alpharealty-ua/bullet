import { useAppContext } from '../context/use-app-context'
import { multipliers } from '../utils/constants'
import { Bet } from './bet'
import { Bullets } from './bullets'
import { Multiplier } from './multiplier'

const Footer = () => {
  const { state, bet, countBullet, activeMultiplierIndex } = useAppContext()

  return (
    <div className='relative flex h-[74px] items-center bg-[url(/assets/images/bottom-line.jpg)] bg-[-20px_top] px-1 py-1'>
      <div className='flex flex-col gap-1'>
        <button className='h-[17px] w-[17px] cursor-pointer bg-[url(/assets/images/settings.png)] bg-cover'></button>
        <div className='h-[42px] w-[29px] bg-[url(/assets/images/bag.png)] bg-contain bg-center bg-no-repeat'></div>
      </div>
      <Bet value={bet} />
      <Bullets countBullet={countBullet} />
      <div className='w-[100px]'>
        {state !== 'reset' &&
          state !== 'start-game' &&
          state !== 'bet' &&
          state !== 'pull-start' && (
            <Multiplier
              items={multipliers}
              activeIndex={activeMultiplierIndex}
            />
          )}
      </div>
    </div>
  )
}

export { Footer }
