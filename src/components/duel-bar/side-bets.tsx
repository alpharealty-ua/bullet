import { Bet } from '@/components/bet'
import { Button } from '@/components/ui/button'
import { LiveWagers } from './live-wagers'
import { mockWagerList } from '../../lib/mocks'

const SideBets = () => {
  return (
    <div className='flex gap-2'>
      <div className='flex w-[210px] shrink-0 flex-col gap-2'>
        <h3>PLACE WAGERS ON LIVE GAMES</h3>
        <ul className='flex flex-col gap-0.5'>
          <li>
            BET ON: <span className='text-[#006100]'>YOKOZUNA</span>{' '}
            <button className='inline-flex h-4 w-4 rounded-full border-2 border-black bg-[#006100] align-middle'></button>
          </li>
          <li>Survival ODDS: 66.6%</li>
          <li>BETTING ODDS: -200</li>
        </ul>
        <div className='py-6'>
          <Bet label='' />
        </div>
        <div className='flex justify-end'>
          <Button text='Bet' bg='green' />
        </div>
      </div>
      <div className='-my-1 w-0.5 shrink-0 bg-black'></div>
      <LiveWagers list={mockWagerList} />
    </div>
  )
}

export { SideBets }
