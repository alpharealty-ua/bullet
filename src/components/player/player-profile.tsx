import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlayerStatistics } from '@/components/player/player-statistics'
import { RecentGames } from '@/components/player/recent-games'
import { Trophies } from '@/components/player/trophies'
import { PerformanceTrend } from '@/components/player/player-perfomance-trend'

interface PlayerProfileProps {
  playerId: string
}

const PlayerProfile = ({ playerId }: PlayerProfileProps) => {
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
        <PlayerStatistics playerId={playerId} />
        <RecentGames playerId={playerId} />
        <Trophies playerId={playerId} />
      </TabsContent>
      <TabsContent value='levelProgress' className='flex grow flex-col gap-6'>
        <div className='cuctom-scroll pr-4'>
          <PerformanceTrend playerId={playerId} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
export { PlayerProfile }
