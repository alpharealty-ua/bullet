import { FaPlay } from 'react-icons/fa'

import { Bet } from '@/components/bet'
import { Button } from '@/components/ui/button'

export const PlaceWager = () => {
  return (
    <div className='flex w-[220px] shrink-0 flex-col gap-2'>
      <h3>PLACE WAGERS ON LIVE GAMES</h3>
      <ul className='flex flex-col gap-0.5'>
        <li>
          BET ON:
          <button className='text-green hover:text-red group inline-flex cursor-pointer gap-1 transition-all'>
            <span>YOKOZUNA</span>
            <span className='bg-green group-hover:bg-red group-hover:border-red inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-black align-middle text-white transition-all'>
              <FaPlay size={8} />
            </span>
          </button>
        </li>
        <li>Survival ODDS: 66.6%</li>
        <li>BETTING ODDS: -200</li>
      </ul>
      <div className='py-6'>
        {/* TODO: ENLARGE  */}
        <Bet label='' />
      </div>
      <div className='flex justify-end'>
        <Button text='Bet' bg='green' />
      </div>
    </div>
  )
}
