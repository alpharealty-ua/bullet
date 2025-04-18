import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

import { GetStatsResponse } from '@/api/leaderboard.api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DistributionByLevelProps {
  list: GetStatsResponse['levelDistribution']
}

const DistributionByLevel = ({ list }: DistributionByLevelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Distribution by LVL</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={list}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='range' />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} Players`, 'Count']} />
              <Bar dataKey='count' name='Players'>
                {list.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='mt-4 grid grid-cols-3 gap-2'>
          {list.map((tier) => (
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
  )
}

export { DistributionByLevel }
