import { useProfile } from '@/api/auth.api'
import { useGameStats } from '@/api/leadboard.api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loading } from '@/components/loading'
import { DistributionByLevel } from '@/components/leaderboard/distribution-by-level'
import { RegionalDistribution } from '@/components/leaderboard/regional-distribution'
import { LevelMilestones } from '@/components/leaderboard/level-milestones'
import { TopPlayers } from '@/components/leaderboard/top-players'
import { RegionalChampions } from '@/components/leaderboard/regional-champions'
import { RisingStars } from '@/components/leaderboard/rising-stars'
import { PlayerProfile } from '@/components/leaderboard/player-profile'

const Leaderboard = () => {
  const { data: leaderboardData, isLoading, isSuccess } = useGameStats()
  const { data: user } = useProfile()

  if (isLoading || !isSuccess) {
    return <Loading />
  }

  return (
    <Tabs
      className='flex shrink-0 grow flex-col overflow-hidden'
      defaultValue='profile'
    >
      <TabsList>
        <TabsTrigger value='profile'>
          Player profile: {user?.username}
        </TabsTrigger>
        <TabsTrigger value='top'>Top 20 Players</TabsTrigger>
        <TabsTrigger value='stats'>Regional Champions</TabsTrigger>
        <TabsTrigger value='milestones' className='flex flex-col'>
          Rising Stars{' '}
          <span className='text-[0.6rem] text-gray-500 [[data-state=active]_&]:text-gray-700'>
            (Players with over 100 Games)
          </span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value='profile' className='custom-scroll grow'>
        <PlayerProfile />
      </TabsContent>
      <TabsContent value='top' className='custom-scroll grow'>
        <TopPlayers
          topPlayers={leaderboardData.topPlayers}
          user={user ?? null}
        />
      </TabsContent>
      <TabsContent
        value='stats'
        className='custom-scroll flex grow flex-col gap-6'
      >
        <RegionalChampions user={user ?? null} />
        <DistributionByLevel
          levelDistribution={leaderboardData.levelDistribution}
        />
        <RegionalDistribution regions={leaderboardData.regions} />
      </TabsContent>
      <TabsContent value='milestones' className='custom-scroll grow'>
        <RisingStars user={user ?? null} />
        <LevelMilestones milestones={leaderboardData.milestones} />
      </TabsContent>
    </Tabs>
  )
}

export { Leaderboard }
