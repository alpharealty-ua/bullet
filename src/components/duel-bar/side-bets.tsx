import { mockWagerList } from '@/lib/mocks'
import { LiveWagers } from './live-wagers'
import { PlaceWager } from './place-wager'

const SideBets = () => {
  return (
    <div className='flex gap-2'>
      <PlaceWager />
      <div className='-my-1 w-0.5 shrink-0 bg-black'></div>
      <LiveWagers list={mockWagerList} />
    </div>
  )
}

export { SideBets }
