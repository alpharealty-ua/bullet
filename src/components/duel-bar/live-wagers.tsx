import { cn } from '@/lib/utils'

const LiveWagers = ({ list }: { list: Wager[] }) => {
  return (
    <div className='flex flex-col justify-between'>
      <table className='text-left text-xs'>
        <thead>
          <tr>
            <th className='text-sm'>USER</th>
            <th className='text-sm'>RISK</th>
          </tr>
        </thead>
        <tfoot>
          {list.map(({ id, user, money, result }) => (
            <tr key={id}>
              <td className='py-0.5'>{user}</td>
              <td
                className={cn(
                  'py-0.5',
                  result === 'win' && 'text-[#006100]',
                  result === 'lose' && 'text-[#ff0000]',
                )}
              >
                ${money}
              </td>
            </tr>
          ))}
        </tfoot>
      </table>
      <div>LIVE WAGERS</div>
    </div>
  )
}

export { LiveWagers }
