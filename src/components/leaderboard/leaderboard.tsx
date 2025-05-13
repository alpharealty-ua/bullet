import { useProfile } from '@/api/auth.api'
import { useGameStats } from '@/api/leaderboard.api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loading } from '@/components/ui/loading'
import { TopPlayers } from '@/components/leaderboard/top-players'
import { RegionalChampions } from '@/components/leaderboard/regional-champions'
import { RisingStars } from '@/components/leaderboard/rising-stars'
import { RequestError } from '@/components/ui/request-error'

const Leaderboard = () => {
  const { data: leaderboardData, isLoading, isSuccess, error } = useGameStats()
  const { data: user = null } = useProfile()

  if (isLoading) {
    return <Loading />
  }

  if (!isSuccess) {
    return <RequestError error={error} />
  }

  return (
    <Tabs className='grow' defaultValue='top'>
      <TabsList>
        <TabsTrigger value='top'>Top 20 Players</TabsTrigger>
        <TabsTrigger value='stats'>Regional Champions</TabsTrigger>
        <TabsTrigger value='milestones'>
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
