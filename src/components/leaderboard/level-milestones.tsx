import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { GetStatsResponse } from '@/api/leaderboard.api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getLevelColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface LevelMilestonesProps {
  list: GetStatsResponse['milestones']
}

const LevelMilestones = ({ list }: LevelMilestonesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>LVL Milestones & Rankings</CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='h-64 p-6'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={list}>
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
        <div className='custom-scroll overflow-auto'>
          <table className='w-full divide-y divide-gray-200 text-sm'>
            <thead>
              <tr className='bg-gray-50 text-gray-500 uppercase'>
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
              {list.map((milestone, i) => (
                <tr key={i} className='bg-blue-50'>
                  <td className='px-2 py-2 whitespace-nowrap'>
                    <span
                      className={cn(`font-bold`, getLevelColor(milestone.lvl))}
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
          Your current LVL (53) places you in the top 35% of all players.
        </div>
      </CardContent>
    </Card>
  )
}

export { LevelMilestones }
