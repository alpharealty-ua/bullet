import { useProfile } from '@/api/auth.api'
import { useGameStats } from '@/api/leaderboard.api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loading } from '@/components/loading'
import { TopPlayers } from '@/components/leaderboard/top-players'
import { RegionalChampions } from '@/components/leaderboard/regional-champions'
import { RisingStars } from '@/components/leaderboard/rising-stars'

const Leaderboard = () => {
  const { data: leaderboardData, isLoading, isSuccess } = useGameStats()
  const { data: user = null } = useProfile()

  if (isLoading || !isSuccess) {
    return <Loading />
  }

  return (
    <Tabs
      className='flex shrink-0 grow flex-col overflow-hidden'
      defaultValue='top'
    >
      <TabsList>
        <TabsTrigger value='top' className='flex w-full flex-col'>
          Top 20 Players
        </TabsTrigger>
        <TabsTrigger value='stats' className='flex w-full flex-col'>
          Regional Champions
        </TabsTrigger>
        <TabsTrigger value='milestones' className='flex w-full flex-col'>
          Rising Stars{' '}
          <span className='text-[0.6rem] text-gray-500 [[data-state=active]_&]:text-gray-700'>
            (Players with over 100 Games)
          </span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value='top' className='flex grow flex-col gap-6'>
        <div className='custom-scroll'>
          <TopPlayers list={leaderboardData.topPlayers} user={user} />
        </div>
      </TabsContent>
      <TabsContent value='stats' className='flex grow flex-col gap-6'>
        <div className='custom-scroll'>
          <RegionalChampions
            list={leaderboardData.regionalChampions}
            user={user}
          />
        </div>
      </TabsContent>
      <TabsContent value='milestones' className='flex grow flex-col gap-6'>
        <div className='custom-scroll'>
          <RisingStars list={leaderboardData.risingStars} user={user} />
        </div>
      </TabsContent>
    </Tabs>
  )
}

export { Leaderboard }
