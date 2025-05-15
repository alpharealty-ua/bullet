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
import { PersonalStatistics } from '@/components/player/personal-statistics'
import { RecentGames } from '@/components/player/recent-games'
import { Trophies } from '@/components/player/trophies'
import { RequestError } from '@/components/ui/request-error'

const PlayerProfile = ({ playerId }: { playerId: string }) => {
  // TODO: MOVE TO COMPONENTS
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

  const { performanceTrend } = playerStatistics

  return (
    <Tabs defaultValue='personalStatistics'>
      <TabsList>
        <TabsTrigger value='personalStatistics'>
          Personal statistics
        </TabsTrigger>
        <TabsTrigger value='levelProgress'>
          LVL Progress Over&nbsp;Time
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value='personalStatistics'
        className='flex grow flex-col gap-2'
      >
        <PersonalStatistics playerId={playerId} />
        <RecentGames playerId={playerId} />
        <Trophies playerId={playerId} />
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
