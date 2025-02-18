import { cn } from '@/lib/utils'
import { Bet } from '@/components/bet'

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
          <button
            className={cn(
              'relative inline-flex cursor-pointer items-center justify-center rounded-sm border-2 border-black bg-[#006100] bg-contain bg-center bg-no-repeat px-3 py-1 transition-transform active:scale-75 disabled:scale-100 disabled:cursor-not-allowed',
            )}
          >
            <span className='text-xl font-bold text-white uppercase'>Bet</span>
          </button>
        </div>
      </div>
      <div className='-my-1 w-0.5 shrink-0 bg-black'></div>
      <div className='flex flex-col justify-between'>
        <table className='text-left text-xs'>
          <thead>
            <tr>
              <th className='text-base'>USER</th>
              <th className='text-base'>RISK</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td className='py-0.5'>BILL2</td>
              <td className='py-0.5 text-[#006100]'>$1000</td>
            </tr>
            <tr>
              <td className='py-0.5'>HARVY</td>
              <td className='py-0.5 text-[#ff0000]'>$500</td>
            </tr>
            <tr className=''>
              <td className='py-0.5'>SMART</td>
              <td className='py-0.5 text-[#ff0000]'>$1000</td>
            </tr>
            <tr>
              <td className='py-0.5'>FIREA</td>
              <td className='py-0.5 text-[#ff0000]'>$2000</td>
            </tr>
          </tfoot>
        </table>
        <div>LIVE WAGERS</div>
      </div>
    </div>
  )
}

export { SideBets }
