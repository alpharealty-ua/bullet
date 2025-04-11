import { useProfile } from '@/api/auth.api'
import { useGameStats } from '@/api/leadboard.api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loading } from '@/components/loading'
import { DistributionByLevel } from '@/components/distribution-by-level'
import { RegionalDistribution } from '@/components/regional-distribution'
import { LevelMilestones } from '@/components/level-milestones'
import { TopPlayers } from '@/components/top-players'

const Leaderboard = () => {
  const { data: leaderboardData, isLoading, isSuccess } = useGameStats()
  const { data: user } = useProfile()

  if (isLoading || !isSuccess) {
    return <Loading />
  }

  return (
    <Tabs
      className='flex shrink-0 grow flex-col overflow-hidden'
      defaultValue='top'
    >
      <TabsList>
        <TabsTrigger value='top'>Top Players</TabsTrigger>
        <TabsTrigger value='stats'>Population Stats</TabsTrigger>
        <TabsTrigger value='milestones'>LVL Milestones</TabsTrigger>
      </TabsList>
      <TabsContent value='top' className='custom-scroll grow'>
        <TopPlayers
          topPlayers={leaderboardData.topPlayers}
          user={user ?? null}
        />
      </TabsContent>
      <TabsContent value='stats' className='custom-scroll grow'>
        <div className='flex flex-col gap-6'>
          <DistributionByLevel
            levelDistribution={leaderboardData.levelDistribution}
          />
          <RegionalDistribution regions={leaderboardData.regions} />
        </div>
      </TabsContent>
      <TabsContent value='milestones' className='custom-scroll grow'>
        <LevelMilestones milestones={leaderboardData.milestones} />
      </TabsContent>
    </Tabs>
  )
}

export { Leaderboard }
