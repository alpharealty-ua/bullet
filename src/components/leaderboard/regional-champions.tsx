import { cn } from '@/lib/utils'
import { getLevelColor, getRegionFlag } from './utils'

const regionData = [
  {
    region: 'North America',
    flag: '🇺🇸',
    username: 'ShadowStriker',
    rank: 1,
    lvl: 982,
    precision: 990,
    speed: 964,
    perfectHitPercent: 18.7,
    wins: 312,
    losses: 40,
  },
  {
    region: 'Asia',
    flag: '🇰🇷',
    username: 'Quantum',
    rank: 2,
    lvl: 967,
    precision: 978,
    speed: 941,
    perfectHitPercent: 17.2,
    wins: 296,
    losses: 46,
  },
  {
    region: 'Europe',
    flag: '🇬🇧',
    username: 'NightHawk',
    rank: 3,
    lvl: 954,
    precision: 961,
    speed: 938,
    perfectHitPercent: 16.9,
    wins: 321,
    losses: 57,
  },
  {
    region: 'South America',
    flag: '🇧🇷',
    username: 'VortexQueen',
    rank: 5,
    lvl: 926,
    precision: 940,
    speed: 894,
    perfectHitPercent: 15.8,
    wins: 279,
    losses: 52,
  },
  {
    region: 'Oceania',
    flag: '🇦🇺',
    username: 'EliteTrigger',
    rank: 10,
    lvl: 879,
    precision: 903,
    speed: 826,
    perfectHitPercent: 13.5,
    wins: 236,
    losses: 72,
  },
  {
    region: 'Africa',
    flag: '🇿🇦',
    username: 'ThunderBolt',
    rank: 15,
    lvl: 843,
    precision: 825,
    speed: 885,
    perfectHitPercent: 12.6,
    wins: 234,
    losses: 86,
  },
]

interface RegionalChampionsProps {
  user: User | null
}

const RegionalChampions = ({ user }: RegionalChampionsProps) => {
  return (
    <table className='w-full divide-y divide-gray-200 text-center text-sm'>
      <thead>
        <tr className='bg-gray-50 text-gray-500 uppercase'>
          <th className='px-2 py-3 text-left font-normal whitespace-nowrap'>
            Region
          </th>
          <th className='px-2 py-3 text-left font-normal whitespace-nowrap'>
            Champion
          </th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Country</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>LVL</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Precision</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Speed</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>
            Perfect Hit %
          </th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>
            W/L Record
          </th>
        </tr>
      </thead>
      <tbody>
        {regionData.map((player) => {
          const isPlayer = player.username === user?.username

          return (
            <tr
              key={player.username}
              className={cn(
                'bg-white duration-150 even:bg-gray-50 hover:bg-gray-50',
                isPlayer && 'bg-blue-50 hover:bg-blue-100',
              )}
            >
              <td className='px-2 py-3 text-left'>
                <div className='flex h-10 w-10 flex-1 items-center justify-center rounded-full bg-gray-100'>
                  {getRegionFlag(player.region)}
                </div>
              </td>
              <td className='px-2 py-3 text-left'>{player.username}</td>
              <td className='px-2 py-3'>
                <span className='text-xl'>{player.flag}</span>
              </td>
              <td className='px-2 py-3'>
                <div className={getLevelColor(player.lvl)}>{player.lvl}</div>
              </td>
              <td className='px-2 py-3'>{player.precision}</td>
              <td className='px-2 py-3'>{player.speed}</td>
              <td className='px-2 py-3'>{player.perfectHitPercent}%</td>
              <td className='px-2 py-3 whitespace-nowrap'>
                <span className='font-medium text-green-600'>
                  {player.wins}W
                </span>
                <span>/</span>
                <span className='font-medium text-red-600'>
                  {player.losses}L
                </span>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export { RegionalChampions }
