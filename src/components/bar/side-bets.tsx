import { mockWagerList } from '@/lib/mocks'
import { LiveWagers } from '@/components/bar/live-wagers'
import { PlaceWager } from '@/components/bar/place-wager'

const SideBets = () => {
  return <div className='text-3xl'>COMING SOON</div>

  return (
    <div className='flex gap-2'>
      <PlaceWager />
      <div className='-my-1 w-0.5 shrink-0 bg-black'></div>
      <LiveWagers list={mockWagerList} />
    </div>
  )
}

export { SideBets }
