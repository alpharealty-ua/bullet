import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts'

const personalStats = {
  name: 'YOU',
  country: '🇺🇸',
  region: 'US',
  lvl: 920,
  precision: 935,
  speed: 910,
  perfectHitPercent: 15.4,
  wins: 280,
  losses: 60,
}

const recentGames = [
  {
    opponent: 'Quantum',
    opponentLvl: 967,
    result: 'Win',
    date: '2025-04-09',
    lvlChange: +8,
  },
  {
    opponent: 'VortexQueen',
    opponentLvl: 926,
    result: 'Loss',
    date: '2025-04-08',
    lvlChange: -6,
  },
  {
    opponent: 'TitanX',
    opponentLvl: 908,
    result: 'Win',
    date: '2025-04-07',
    lvlChange: +7,
  },
  {
    opponent: 'RapidFire',
    opponentLvl: 897,
    result: 'Win',
    date: '2025-04-06',
    lvlChange: +6,
  },
  {
    opponent: 'DeadEye',
    opponentLvl: 852,
    result: 'Loss',
    date: '2025-04-05',
    lvlChange: -5,
  },
  {
    opponent: 'SharpShooter',
    opponentLvl: 848,
    result: 'Win',
    date: '2025-04-04',
    lvlChange: +6,
  },
  {
    opponent: 'SniperElite',
    opponentLvl: 838,
    result: 'Win',
    date: '2025-04-03',
    lvlChange: +6,
  },
  {
    opponent: 'SteadyHand',
    opponentLvl: 818,
    result: 'Loss',
    date: '2025-04-02',
    lvlChange: -4,
  },
  {
    opponent: 'PixelPerfect',
    opponentLvl: 812,
    result: 'Win',
    date: '2025-04-01',
    lvlChange: +5,
  },
  {
    opponent: 'ThunderBolt',
    opponentLvl: 843,
    result: 'Win',
    date: '2025-03-31',
    lvlChange: +5,
  },
  {
    opponent: 'NightHawk',
    opponentLvl: 954,
    result: 'Loss',
    date: '2025-03-30',
    lvlChange: -7,
  },
  {
    opponent: 'AceTactician',
    opponentLvl: 822,
    result: 'Win',
    date: '2025-03-29',
    lvlChange: +6,
  },
  {
    opponent: 'VelocityPrime',
    opponentLvl: 867,
    result: 'Loss',
    date: '2025-03-28',
    lvlChange: -5,
  },
  {
    opponent: 'EliteTrigger',
    opponentLvl: 879,
    result: 'Win',
    date: '2025-03-27',
    lvlChange: +6,
  },
  {
    opponent: 'SilentScope',
    opponentLvl: 884,
    result: 'Win',
    date: '2025-03-26',
    lvlChange: +7,
  },
  {
    opponent: 'BlitzKrieg',
    opponentLvl: 937,
    result: 'Loss',
    date: '2025-03-25',
    lvlChange: -6,
  },
  {
    opponent: 'PhantomShot',
    opponentLvl: 915,
    result: 'Win',
    date: '2025-03-24',
    lvlChange: +6,
  },
  {
    opponent: 'PrecisionKing',
    opponentLvl: 860,
    result: 'Win',
    date: '2025-03-23',
    lvlChange: +5,
  },
  {
    opponent: 'QuickDraw',
    opponentLvl: 829,
    result: 'Loss',
    date: '2025-03-22',
    lvlChange: -4,
  },
  {
    opponent: 'NightHawk',
    opponentLvl: 954,
    result: 'Win',
    date: '2025-03-21',
    lvlChange: +8,
  },
]

const PlayerProfile = () => {
  const lvlChartData = recentGames
    .map((game, i) => ({
      date: game.date,
      lvl: 900 + i + (i % 3) * 2,
    }))
    .reverse()

  return (
    <div className='space-y-10 bg-gray-100'>
      <div className='rounded-lg bg-white shadow-md'>
        <table className='w-full divide-y divide-gray-200 text-center text-sm'>
          <tbody>
            <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-gray-50'>
              <td className='px-2 py-3 font-semibold text-gray-700'>Country</td>
              <td className='px-2 py-3'>
                {personalStats.country} ({personalStats.region})
              </td>
            </tr>
            <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-gray-50'>
              <td className='px-2 py-3 font-semibold text-gray-700'>Level</td>
              <td className='px-2 py-3'>{personalStats.lvl}</td>
            </tr>
            <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-gray-50'>
              <td className='px-2 py-3 font-semibold text-gray-700'>
                Precision
              </td>
              <td className='px-2 py-3'>{personalStats.precision}</td>
            </tr>
            <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-gray-50'>
              <td className='px-2 py-3 font-semibold text-gray-700'>Speed</td>
              <td className='px-2 py-3'>{personalStats.speed}</td>
            </tr>
            <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-gray-50'>
              <td className='px-2 py-3 font-semibold text-gray-700'>
                Perfect Hit %
              </td>
              <td className='px-2 py-3'>{personalStats.perfectHitPercent}%</td>
            </tr>
            <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-gray-50'>
              <td className='px-2 py-3 font-semibold text-gray-700'>Record</td>
              <td className='px-2 py-3 font-medium'>
                <span className='text-green-600'>{personalStats.wins}W</span>/
                <span className='text-red-600'>{personalStats.losses}L</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='rounded-lg bg-white p-4'>
        <h2 className='pb-2 text-center text-xl font-bold text-gray-800 md:text-2xl'>
          LVL Progress Over Time
        </h2>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={lvlChartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' tick={{ fontSize: 12 }} />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='lvl'
              stroke='#ee8100'
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className='rounded-lg bg-white'>
        <h2 className='border-b p-4 text-center text-xl font-bold text-gray-800 md:text-2xl'>
          Recent Matches
        </h2>
        <table className='w-full divide-y divide-gray-200 text-center text-sm'>
          <thead>
            <tr className='bg-gray-50 text-gray-500 uppercase'>
              <th className='px-2 py-3 text-left font-normal whitespace-nowrap'>
                Opponent
              </th>
              <th className='px-2 py-3 font-normal whitespace-nowrap'>LVL</th>
              <th className='px-2 py-3 font-normal whitespace-nowrap'>
                Result
              </th>
              <th className='px-2 py-3 font-normal whitespace-nowrap'>Date</th>
              <th className='px-2 py-3 font-normal whitespace-nowrap'>
                LVL Gained
              </th>
            </tr>
          </thead>
          <tbody>
            {recentGames.map((game, index) => (
              <tr
                key={index}
                className={`${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'} transition-colors hover:bg-blue-50`}
              >
                <td className='px-2 py-3 text-left'>{game.opponent}</td>
                <td className='px-2 py-3'>{game.opponentLvl}</td>
                <td
                  className={`px-2 py-3 font-medium ${game.result === 'Win' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {game.result}
                </td>
                <td className='px-2 py-3'>{game.date}</td>
                <td
                  className={`px-2 py-3 font-normal whitespace-nowrap ${game.lvlChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {game.lvlChange >= 0 ? `+${game.lvlChange}` : game.lvlChange}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export { PlayerProfile }
