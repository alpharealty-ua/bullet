import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/logo'

const flags = {
  NA: '🇺🇸',
  EU: '🇪🇺',
  ASIA: '🇯🇵',
  SA: '🇧🇷',
  OCE: '🇦🇺',
} as const

const getRegionFlag = (region: keyof typeof flags) => {
  return flags[region] ?? '🌍'
}

const getFlagColor = (lvl: number) => {
  if (lvl >= 91) return '#7E22CE'
  if (lvl >= 81) return '#8B5CF6'
  if (lvl >= 61) return '#3B82F6'
  if (lvl >= 41) return '#10B981'
  if (lvl >= 21) return '#F59E0B'
  return '#9CA3AF'
}

const CURRENT_LEVEL = 53

const global = [
  {
    rank: 1,
    username: 'XxTimingGodxX',
    lvl: 98,
    precision: 99,
    consistency: 97,
    speed: 98,
    region: 'NA',
    wins: 1247,
    losses: 98,
  },
  {
    rank: 2,
    username: 'PrecisionKing',
    lvl: 97,
    precision: 99,
    consistency: 95,
    speed: 97,
    region: 'EU',
    wins: 1089,
    losses: 102,
  },
  {
    rank: 3,
    username: 'FlawlessAim',
    lvl: 96,
    precision: 98,
    consistency: 96,
    speed: 94,
    region: 'ASIA',
    wins: 952,
    losses: 87,
  },
  {
    rank: 4,
    username: 'ReflexProdigy',
    lvl: 95,
    precision: 97,
    consistency: 96,
    speed: 93,
    region: 'NA',
    wins: 886,
    losses: 91,
  },
  {
    rank: 5,
    username: 'TimeWarp',
    lvl: 94,
    precision: 95,
    consistency: 94,
    speed: 95,
    region: 'EU',
    wins: 842,
    losses: 101,
  },
  {
    rank: 6,
    username: 'ShotCaller',
    lvl: 93,
    precision: 95,
    consistency: 91,
    speed: 94,
    region: 'NA',
    wins: 764,
    losses: 98,
  },
  {
    rank: 7,
    username: 'DeadEye',
    lvl: 92,
    precision: 96,
    consistency: 89,
    speed: 93,
    region: 'ASIA',
    wins: 731,
    losses: 105,
  },
  {
    rank: 8,
    username: 'TimingGenius',
    lvl: 91,
    precision: 94,
    consistency: 90,
    speed: 91,
    region: 'EU',
    wins: 712,
    losses: 112,
  },
  {
    rank: 9,
    username: 'AimGod',
    lvl: 90,
    precision: 93,
    consistency: 91,
    speed: 90,
    region: 'NA',
    wins: 689,
    losses: 114,
  },
  {
    rank: 10,
    username: 'QuickScope',
    lvl: 89,
    precision: 92,
    consistency: 89,
    speed: 92,
    region: 'OCE',
    wins: 651,
    losses: 98,
  },
  {
    rank: 25,
    username: 'SteadyAim',
    lvl: 85,
    precision: 87,
    consistency: 89,
    speed: 82,
    region: 'NA',
    wins: 512,
    losses: 105,
  },
  {
    rank: 50,
    username: 'PrecisionShot',
    lvl: 81,
    precision: 84,
    consistency: 81,
    speed: 78,
    region: 'EU',
    wins: 431,
    losses: 132,
  },
  {
    rank: 100,
    username: 'AccurateTimer',
    lvl: 78,
    precision: 80,
    consistency: 77,
    speed: 76,
    region: 'ASIA',
    wins: 371,
    losses: 129,
  },
  {
    rank: 500,
    username: 'GoodEnough',
    lvl: 69,
    precision: 72,
    consistency: 68,
    speed: 67,
    region: 'NA',
    wins: 241,
    losses: 154,
  },
  {
    rank: 1000,
    username: 'CasualAimer',
    lvl: 62,
    precision: 65,
    consistency: 61,
    speed: 60,
    region: 'SA',
    wins: 187,
    losses: 172,
  },
] as const

const leaderboardData = {
  global,
  // Distribution statistics
  distribution: [
    { range: '1-20', count: 500, color: '#9CA3AF' },
    { range: '21-40', count: 2000, color: '#F59E0B' },
    { range: '41-60', count: 4500, color: '#10B981' },
    { range: '61-80', count: 2300, color: '#3B82F6' },
    { range: '81-90', count: 600, color: '#8B5CF6' },
    { range: '91-100', count: 100, color: '#7E22CE' },
  ],
  // Region breakdown
  regions: [
    { name: 'North America', count: 3500, percentage: 35 },
    { name: 'Europe', count: 3000, percentage: 30 },
    { name: 'Asia', count: 2200, percentage: 22 },
    { name: 'South America', count: 800, percentage: 8 },
    { name: 'Oceania', count: 500, percentage: 5 },
  ],
}

const milestones = [
  { lvl: 95, rank: 5, percentile: 99.95 },
  { lvl: 91, rank: 100, percentile: 99.0 },
  { lvl: 85, rank: 300, percentile: 97.0 },
  { lvl: 81, rank: 700, percentile: 93.0 },
  { lvl: 75, rank: 1200, percentile: 88.0 },
  { lvl: 70, rank: 1800, percentile: 82.0 },
  { lvl: 65, rank: 2400, percentile: 76.0 },
  { lvl: 61, rank: 3000, percentile: 70.0 },
  { lvl: 55, rank: 5000, percentile: 50.0 },
  { lvl: 45, rank: 7000, percentile: 30.0 },
  { lvl: 35, rank: 8500, percentile: 15.0 },
  { lvl: 25, rank: 9500, percentile: 5.0 },
]

const LeaderboardPage = () => {
  return (
    <div>
      <div className='flex justify-center px-3 pt-4'>
        <Logo to='/' size='lg' />
      </div>
      <div className='p-6 pb-0'>
        <h1 className='mb-2 text-2xl font-bold'>Bullet Timing Leaderboard</h1>
        <p className='mb-6 text-gray-500'>Population: 10,000 Players</p>
      </div>
      <Tabs defaultValue='top'>
        <TabsList>
          <TabsTrigger value='top'>Top Players</TabsTrigger>
          <TabsTrigger value='stats'>Population Stats</TabsTrigger>
          <TabsTrigger value='milestones'>LVL Milestones</TabsTrigger>
        </TabsList>
        <TabsContent value='top'>
          <div className='custom-scroll overflow-auto rounded-lg bg-white shadow'>
            <div className='inline-block'>
              <table className='w-full divide-y divide-gray-200'>
                <thead>
                  <tr className='bg-gray-50'>
                    <th
                      scope='col'
                      className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
                    >
                      Rank
                    </th>
                    <th
                      scope='col'
                      className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
                    >
                      Player
                    </th>
                    <th
                      scope='col'
                      className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
                    >
                      LVL
                    </th>
                    <th
                      scope='col'
                      className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
                    >
                      Precision
                    </th>
                    <th
                      scope='col'
                      className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
                    >
                      Consistency
                    </th>
                    <th
                      scope='col'
                      className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
                    >
                      Speed
                    </th>
                    <th
                      scope='col'
                      className='px-2 py-3 text-left font-medium tracking-wider text-gray-500 uppercase'
                    >
                      W/L
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {leaderboardData.global.map((player) => (
                    <tr key={player.username} className='hover:bg-gray-50'>
                      <td className='px-2 py-3 text-sm font-medium whitespace-nowrap text-gray-900'>
                        #{player.rank}
                      </td>
                      <td className='px-2 py-3 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100'>
                            {getRegionFlag(player.region)}
                          </div>
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>
                              {player.username}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {player.region}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-2 py-3 whitespace-nowrap'>
                        <div
                          className='text-sm font-bold text-gray-900'
                          style={{ color: getFlagColor(player.lvl) }}
                        >
                          {player.lvl}
                        </div>
                      </td>
                      <td className='px-2 py-3 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {player.precision}
                        </div>
                      </td>
                      <td className='px-2 py-3 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {player.consistency}
                        </div>
                      </td>
                      <td className='px-2 py-3 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {player.speed}
                        </div>
                      </td>
                      <td className='px-2 py-3 text-sm whitespace-nowrap text-gray-500'>
                        {player.wins}W / {player.losses}L
                      </td>
                    </tr>
                  ))}
                  <tr className='bg-blue-50 hover:bg-blue-100'>
                    <td className='px-2 py-3 text-sm font-medium whitespace-nowrap text-gray-900'>
                      #3426
                    </td>
                    <td className='px-2 py-3 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100'>
                          🇺🇸
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            YOU (SharpShooter)
                          </div>
                          <div className='text-sm text-gray-500'>NA</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-2 py-3 whitespace-nowrap'>
                      <div
                        className='text-sm font-bold text-gray-900'
                        style={{ color: getFlagColor(CURRENT_LEVEL) }}
                      >
                        {CURRENT_LEVEL}
                      </div>
                    </td>
                    <td className='px-2 py-3 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>55</div>
                    </td>
                    <td className='px-2 py-3 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>48</div>
                    </td>
                    <td className='px-2 py-3 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>56</div>
                    </td>
                    <td className='px-2 py-3 text-sm whitespace-nowrap text-gray-500'>
                      142W / 128L
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        <TabsContent value='stats'>
          <div className='flex flex-col gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Player Distribution by LVL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='h-64'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={leaderboardData.distribution}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='range' />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`${value} Players`, 'Count']}
                      />
                      <Bar dataKey='count' name='Players'>
                        {leaderboardData.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className='mt-4 grid grid-cols-3 gap-2'>
                  {leaderboardData.distribution.map((tier) => (
                    <div
                      key={tier.range}
                      className='flex items-center rounded p-2'
                      style={{ backgroundColor: `${tier.color}20` }}
                    >
                      <div
                        className='mr-2 h-3 w-3 rounded-full'
                        style={{ backgroundColor: tier.color }}
                      ></div>
                      <div className=''>
                        <div>LVL {tier.range}</div>
                        <div>{tier.count} players</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {leaderboardData.regions.map((region) => (
                    <div key={region.name} className='space-y-1'>
                      <div className='flex justify-between'>
                        <span>{region.name}</span>
                        <span>
                          {region.count} players ({region.percentage}%)
                        </span>
                      </div>
                      <div className='h-2 w-full rounded-full bg-gray-200'>
                        <div
                          className='h-2 rounded-full bg-blue-600'
                          style={{ width: `${region.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-6'>
                  <h4 className='mb-2 font-bold'>Population Insights:</h4>
                  <ul className='space-y-1 text-sm'>
                    <li>• 45% of players are between LVL 41-60</li>
                    <li>• Only 1% of players reach LVL 91+</li>
                    <li>• Average LVL across all players: 52</li>
                    <li>• North America has the highest average LVL: 54</li>
                    <li>• Players typically reach LVL 65+ after 350+ games</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value='milestones'>
          <Card>
            <CardHeader>
              <CardTitle>LVL Milestones & Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='mb-6 h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={milestones}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='lvl'
                      label={{
                        value: 'LVL',
                        position: 'insideBottom',
                        offset: -5,
                      }}
                    />
                    <YAxis
                      yAxisId='left'
                      orientation='left'
                      label={{
                        value: 'Rank',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                      scale='log'
                      domain={[1, 10000]}
                    />
                    <YAxis
                      yAxisId='right'
                      orientation='right'
                      label={{
                        value: 'Percentile',
                        angle: 90,
                        position: 'insideRight',
                      }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'rank' ? `#${value}` : `${value}%`,
                        name === 'rank' ? 'Rank' : 'Percentile',
                      ]}
                    />
                    <Line
                      yAxisId='left'
                      type='monotone'
                      dataKey='rank'
                      name='rank'
                      stroke='#8884d8'
                    />
                    <Line
                      yAxisId='right'
                      type='monotone'
                      dataKey='percentile'
                      name='percentile'
                      stroke='#82ca9d'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className='custom-scroll -mr-6 -ml-6 overflow-auto'>
                <table className='w-full divide-y divide-gray-200 text-sm'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-2 py-3 text-left font-medium text-gray-500 uppercase'>
                        LVL
                      </th>
                      <th className='px-2 py-3 text-left font-medium text-gray-500 uppercase'>
                        Rank
                      </th>
                      <th className='px-2 py-3 text-left font-medium text-gray-500 uppercase'>
                        Percentile
                      </th>
                      <th className='px-2 py-3 text-left font-medium text-gray-500 uppercase'>
                        Better Than
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 bg-white'>
                    {milestones.map((milestone) => (
                      <tr
                        key={milestone.lvl}
                        className={
                          milestone.lvl === CURRENT_LEVEL ? 'bg-blue-50' : ''
                        }
                      >
                        <td className='px-2 py-2 whitespace-nowrap'>
                          <span
                            className={`font-bold ${milestone.lvl === CURRENT_LEVEL ? 'text-blue-600' : ''}`}
                            style={{
                              color:
                                milestone.lvl !== CURRENT_LEVEL
                                  ? getFlagColor(milestone.lvl)
                                  : '',
                            }}
                          >
                            {milestone.lvl}
                          </span>
                        </td>
                        <td className='px-2 py-2 whitespace-nowrap'>
                          #{milestone.rank}
                        </td>
                        <td className='px-2 py-2 whitespace-nowrap'>
                          Top {(100 - milestone.percentile).toFixed(1)}%
                        </td>
                        <td className='px-2 py-2 whitespace-nowrap'>
                          {milestone.percentile.toFixed(1)}% of players
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className='mt-4 text-center text-sm text-gray-500'>
                Your current LVL ({CURRENT_LEVEL}) places you in the top 35% of
                all players.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { LeaderboardPage }
