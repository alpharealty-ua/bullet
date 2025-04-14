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
      <TabsContent value='stats' className='flex grow flex-col gap-6'>
        <div className='custom-scroll'>
          <RegionalChampions user={user ?? null} />
        </div>
        <div className='custom-scroll'>
          <DistributionByLevel
            levelDistribution={leaderboardData.levelDistribution}
          />
        </div>
        <div className='custom-scroll'>
          <RegionalDistribution regions={leaderboardData.regions} />
        </div>
      </TabsContent>
      <TabsContent value='milestones' className='custom-scroll grow'>
        <div className='custom-scroll'>
          <RisingStars user={user ?? null} />
        </div>
        <div className='custom-scroll'>
          <LevelMilestones milestones={leaderboardData.milestones} />
        </div>
      </TabsContent>
    </Tabs>
  )
}

export { Leaderboard }
