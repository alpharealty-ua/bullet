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
import { Loading } from '@/components/ui/loading'
import { RequestError } from '@/components/ui/request-error'

interface PerformanceTrendProps {
  playerId: string
}

const PerformanceTrend = ({ playerId }: PerformanceTrendProps) => {
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

  return (
    <ResponsiveContainer width='100%' height={440}>
      <LineChart data={playerStatistics.performanceTrend}>
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
  )
}

export { PerformanceTrend }
