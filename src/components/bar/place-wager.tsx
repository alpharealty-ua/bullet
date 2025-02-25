import { Bet } from '@/components/bet'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const PlaceWager = () => {
  return (
    <div className='flex w-[220px] shrink-0 flex-col gap-2'>
      <h3>PLACE WAGERS ON LIVE GAMES</h3>
      <div className='mt-6 py-6'>
        <Bet
          topButtonSlot={(value) => (
            <div>
              <div>
                <div>Risk</div>$<span data-value>{value}</span>
              </div>
            </div>
          )}
          bottomSlot={(value) => (
            <div className='relative flex justify-end'>
              <div className='w-full text-lg leading-[1] text-ellipsis'>
                <div>To win</div>$<span data-value>{value}</span>
              </div>
              <div className='absolute h-full'>
                <ButtonWithAudio
                  text='Place bet'
                  bg='primary'
                  className='h-full px-1 text-[10px]'
                />
              </div>
            </div>
          )}
        />
      </div>
      <ul className='flex flex-col gap-0.5'>
        <li>BET ON: YOKOZUNA</li>
        <li>Survival ODDS: 66.6%</li>
        <li>BETTING ODDS: -200</li>
      </ul>
    </div>
  )
}

export { PlaceWager }
