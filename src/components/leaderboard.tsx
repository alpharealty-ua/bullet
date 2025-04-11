import { useProfile } from '@/api/auth.api'
import { useGameStats } from '@/api/leadboard.api'
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
import { Loading } from '@/components/loading'
import { cn } from '@/lib/utils'

const flags = {
  NA: '🇺🇸',
  EU: '🇪🇺',
  ASIA: '🇯🇵',
  SA: '🇧🇷',
  OCE: '🇦🇺',
  RU: 'RU',
} as const

export type FlagKeys = keyof typeof flags

const getRegionFlag = (region: FlagKeys) => {
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

const Leaderboard = () => {
  const { data: leaderboardData, isLoading, isSuccess } = useGameStats()
  const { data: user } = useProfile()

  if (isLoading || !isSuccess) {
    return <Loading />
  }

  return (
    <Tabs className='flex grow flex-col overflow-hidden' defaultValue='top'>
      <TabsList>
        <TabsTrigger value='top'>Top Players</TabsTrigger>
        <TabsTrigger value='stats'>Population Stats</TabsTrigger>
        <TabsTrigger value='milestones'>LVL Milestones</TabsTrigger>
      </TabsList>
      <TabsContent value='top' className='custom-scroll grow'>
        <div className='rounded-lg bg-white shadow'>
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
              {leaderboardData.topPlayers.map((player) => {
                const isPlayer = player.username === user?.username
                // hover:bg-blue-100
                return (
                  <tr
                    key={player.username}
                    className={cn(
                      'hover:bg-gray-50',
                      isPlayer && 'bg-blue-50 hover:bg-blue-100',
                    )}
                  >
                    <td className='px-2 py-3 text-sm font-medium whitespace-nowrap text-gray-900'>
                      #{player.rank}
                    </td>
                    <td className='px-2 py-3 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100'>
                          {getRegionFlag(player.region as FlagKeys)}
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
                )
              })}
            </tbody>
          </table>
        </div>
      </TabsContent>
      <TabsContent value='stats' className='custom-scroll grow'>
        <div className='flex flex-col gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Player Distribution by LVL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={leaderboardData.levelDistribution}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='range' />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} Players`, 'Count']}
                    />
                    <Bar dataKey='count' name='Players'>
                      {leaderboardData.levelDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className='mt-4 grid grid-cols-3 gap-2'>
                {leaderboardData.levelDistribution.map((tier) => (
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
      <TabsContent value='milestones' className='custom-scroll grow'>
        <Card>
          <CardHeader>
            <CardTitle>LVL Milestones & Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='mb-6 h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={leaderboardData.milestones}>
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
                  {leaderboardData.milestones.map((milestone, i) => (
                    <tr
                      key={i}
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
  )
}

export { Leaderboard }
