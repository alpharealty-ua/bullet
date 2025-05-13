import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts'

import { usePlayerStatistics } from '@/api/leaderboard.api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loading } from '@/components/ui/loading'
import { PlayerStatistics } from '@/components/leaderboard/player-statistics'
import { RequestError } from '@/components/ui/request-error'
import { formatDate } from '@/lib/utils'

const PlayerProfile = ({ playerId }: { playerId: string }) => {
  const {
    data: playerStatistics,
    isLoading,
    isSuccess,
    error,
  } = usePlayerStatistics(playerId)

  if (isLoading) {
    return <Loading />
  }

  if (!isSuccess) {
    return <RequestError error={error} />
  }

  const { recentGames, performanceTrend } = playerStatistics

  return (
    <Tabs className='' defaultValue='personalStatistics'>
      <TabsList>
        <TabsTrigger value='personalStatistics'>
          Personal statistics
        </TabsTrigger>
        <TabsTrigger value='stats'>Recent match</TabsTrigger>
        <TabsTrigger value='levelProgress'>
          LVL Progress Over&nbsp;Time
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value='personalStatistics'
        className='flex grow flex-col gap-6'
      >
        <div className='cuctom-scroll'>
          <PlayerStatistics statistics={playerStatistics} />
        </div>
      </TabsContent>
      <TabsContent value='stats' className='flex grow flex-col gap-6'>
        <div className='cuctom-scroll'>
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
                <th className='px-2 py-3 font-normal whitespace-nowrap'>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentGames.map((game, index) => (
                <tr
                  key={index}
                  className='bg-white transition-colors even:bg-gray-50 hover:bg-blue-50'
                >
                  <td className='px-2 py-3 text-left'>
                    {game.opponentUsername}
                  </td>
                  <td className='px-2 py-3'>{game.opponentScore}</td>
                  <td
                    className={`px-2 py-3 font-medium ${game.result === 'win' ? 'text-green' : 'text-red'}`}
                  >
                    {game.result}
                  </td>
                  <td className='px-2 py-3'>
                    {formatDate(new Date(game.date))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>
      <TabsContent value='levelProgress' className='flex grow flex-col gap-6'>
        <div className='cuctom-scroll pr-4'>
          <ResponsiveContainer width='100%' height={440}>
            <LineChart data={performanceTrend}>
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
      </TabsContent>
    </Tabs>
  )
}
export { PlayerProfile }
