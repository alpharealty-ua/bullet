import { cn } from '@/lib/utils'

const risingStarsData = [
  {
    rank: 22,
    displayRank: '#22',
    flag: '🇺🇸',
    username: 'TalentedRookie',
    region: 'North America',
    lvl: 798,
    precision: 821,
    speed: 748,
    perfectHitPercent: 14.7,
    wins: 65,
    losses: 11,
    totalGames: 76,
  },
  {
    rank: 31,
    displayRank: '#31',
    flag: '🇫🇷',
    username: 'FreshProdigy',
    region: 'Europe',
    lvl: 776,
    precision: 801,
    speed: 724,
    perfectHitPercent: 14.3,
    wins: 58,
    losses: 16,
    totalGames: 74,
  },
  {
    rank: 37,
    displayRank: '#37',
    flag: '🇨🇦',
    username: 'NovaNinja',
    region: 'North America',
    lvl: 751,
    precision: 782,
    speed: 683,
    perfectHitPercent: 13.9,
    wins: 42,
    losses: 4,
    totalGames: 46,
  },
  {
    rank: 43,
    displayRank: '#43',
    flag: '🇰🇷',
    username: 'RisingStar',
    region: 'Asia',
    lvl: 742,
    precision: 765,
    speed: 692,
    perfectHitPercent: 13.6,
    wins: 71,
    losses: 23,
    totalGames: 94,
  },
  {
    rank: 49,
    displayRank: '#49',
    flag: '🇩🇪',
    username: 'UpAndComing',
    region: 'Europe',
    lvl: 731,
    precision: 755,
    speed: 678,
    perfectHitPercent: 13.4,
    wins: 67,
    losses: 25,
    totalGames: 92,
  },
  {
    rank: 58,
    displayRank: '#58',
    flag: '🇰🇷',
    username: 'ApexNewbie',
    region: 'Asia',
    lvl: 704,
    precision: 732,
    speed: 642,
    perfectHitPercent: 12.7,
    wins: 31,
    losses: 4,
    totalGames: 35,
  },
  {
    rank: 64,
    displayRank: '#64',
    flag: '🇯🇵',
    username: 'Phenomenon',
    region: 'Asia',
    lvl: 695,
    precision: 718,
    speed: 645,
    perfectHitPercent: 12.4,
    wins: 60,
    losses: 30,
    totalGames: 90,
  },
  {
    rank: 72,
    displayRank: '#72',
    flag: '🇯🇵',
    username: 'FreshAim',
    region: 'Asia',
    lvl: 682,
    precision: 701,
    speed: 640,
    perfectHitPercent: 11.8,
    wins: 32,
    losses: 6,
    totalGames: 38,
  },
  {
    rank: 83,
    displayRank: '#83',
    flag: '🇧🇷',
    username: 'NaturalTalent',
    region: 'South America',
    lvl: 667,
    precision: 688,
    speed: 621,
    perfectHitPercent: 11.6,
    wins: 63,
    losses: 35,
    totalGames: 98,
  },
  {
    rank: 94,
    displayRank: '#94',
    flag: '🇬🇧',
    username: 'RookieAce',
    region: 'Europe',
    lvl: 653,
    precision: 671,
    speed: 613,
    perfectHitPercent: 11.2,
    wins: 34,
    losses: 7,
    totalGames: 41,
  },
]

interface RisingStarsProps {
  user: User | null
}

const RisingStars = ({ user }: RisingStarsProps) => {
  return (
    <table className='w-full divide-y divide-gray-200 text-center text-sm'>
      <thead>
        <tr className='bg-gray-50 text-gray-500 uppercase'>
          <th className='px-2 py-3 text-left font-normal whitespace-nowrap'>
            Player
          </th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Country</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>LVL</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Precision</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Speed</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>
            Perfect Hit %
          </th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Record</th>
          <th className='px-2 py-3 font-normal whitespace-nowrap'>Games</th>
        </tr>
      </thead>
      <tbody>
        {risingStarsData.map((player) => {
          const isPlayer = player.username === user?.username

          return (
            <tr
              key={player.username}
              className={cn(
                'bg-white duration-150 even:bg-gray-50 hover:bg-gray-50',
                isPlayer && 'bg-blue-50 hover:bg-blue-100',
              )}
            >
              <td className='px-2 py-3 text-left'>{player.username}</td>
              <td className='px-2 py-3'>
                <span className='text-xl'>{player.flag}</span>
              </td>
              <td className='px-2 py-3'>{player.lvl}</td>
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
              <td className='px-2 py-3'>{player.totalGames}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
export { RisingStars }
