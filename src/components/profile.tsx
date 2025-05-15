import { useUser } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { RecentGames } from '@/components/player/recent-games'
import { PersonalStatistics } from '@/components/player/personal-statistics'
import { Trophies } from '@/components/player/trophies'
import { PlayerFriends } from './player/player-friends'
import { ChangePasswordForm } from './forms/change-password.form'

interface ProfileProps {
  onLogout?: () => void
}

const Profile = ({ onLogout }: ProfileProps) => {
  const user = useUser()
  const resetTokens = useAuthStore(({ resetTokens }) => resetTokens)

  const handleLogout = async () => {
    onLogout && onLogout()
    resetTokens()
  }

  return (
    <>
      <Tabs className='' defaultValue='personalStatistics'>
        <TabsList>
          <TabsTrigger value='personalStatistics'>
            Personal statistics
          </TabsTrigger>
          <TabsTrigger value='friends'>Friends</TabsTrigger>
          <TabsTrigger value='changePassword'>Change password</TabsTrigger>
        </TabsList>
        <TabsContent
          value='personalStatistics'
          className='flex h-auto grow flex-col justify-start gap-2 overflow-hidden'
        >
          <PersonalStatistics playerId={user.id} />
          <RecentGames playerId={user.id} />
          <Trophies playerId={user.id} />
          <ButtonWithAudio
            as='button'
            className='min-h-8 self-center text-sm'
            bg='red'
            onClick={handleLogout}
          >
            logout
          </ButtonWithAudio>
        </TabsContent>
        <TabsContent value='friends' className='flex grow flex-col gap-2'>
          <PlayerFriends />
        </TabsContent>
        <TabsContent
          value='changePassword'
          className='flex grow flex-col gap-2'
        >
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </>
  )
}

export { Profile }
