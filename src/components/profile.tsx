import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useLogin, useUser } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import {
  ChangePasswordSchema,
  changePasswordSchema,
} from '@/lib/schemas/change-password.schema'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import {
  Form,
  FormControl,
  FormField,
  FormInputPassword,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Notification } from '@/components/ui/notification'
import { RecentGames } from '@/components/player/recent-games'
import { PersonalStatistics } from '@/components/player/personal-statistics'
import { Trophies } from '@/components/player/trophies'

interface ProfileProps {
  onLogout?: () => void
}

const Profile = ({ onLogout }: ProfileProps) => {
  const user = useUser()
  const { error: mutationError, isPending } = useLogin()
  const [isSubmitSuccess, setIsSuccess] = useState(false)
  const resetTokens = useAuthStore(({ resetTokens }) => resetTokens)

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      passwordConfirm: '',
    },
  })

  const handleLogout = async () => {
    onLogout && onLogout()
    resetTokens()
  }

  const handleChangePasswordSubmit = async (values: ChangePasswordSchema) => {
    console.log(values)
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
    }, 1000)
    form.reset()
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
          <div className='grid grid-cols-4 gap-1'>
            {[
              { name: 'Player', online: true },
              { name: 'Player', online: true },
              { name: 'Player', online: true },
              { name: 'Player', online: false },
              { name: 'Player', online: false },
              { name: 'Player', online: false },
              { name: 'Verylongplayername', online: false },
              { name: 'Player', online: false },
              { name: 'Player', online: false },
              { name: 'Player', online: false },
              { name: 'Player', online: false },
              { name: 'Player', online: false },
            ].map((player, i) => (
              <button
                key={i}
                className={cn(
                  'max-w-30 overflow-hidden bg-white px-1 py-4 text-sm text-ellipsis',
                  player.online &&
                    'bg-green hover:bg-green/70 cursor-pointer text-white shadow transition-all',
                  !player.online && 'cursor-not-allowed opacity-33',
                )}
                disabled={!player.online}
                title={player.online ? 'Online' : 'Offline'}
              >
                {`${player.name}`}
              </button>
            ))}
          </div>
        </TabsContent>
        <TabsContent
          value='changePassword'
          className='flex grow flex-col gap-2'
        >
          <div className='flex flex-col items-center gap-4 p-4 px-10'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleChangePasswordSubmit)}
                className='flex w-full flex-col gap-4'
              >
                <FormField
                  control={form.control}
                  name='newPassword'
                  render={({ field: { disabled, ...field } }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <FormInputPassword
                          placeholder='Password'
                          disabled={disabled || isPending}
                          type='password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='passwordConfirm'
                  render={({ field: { disabled, ...field } }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <FormInputPassword
                          placeholder='Confirm password'
                          disabled={disabled || isPending}
                          type='password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Notification
                  type='success'
                  message={isSubmitSuccess ? 'Password updated!' : ''}
                />
                <Notification type='error' message={mutationError?.message} />
                <ButtonWithAudio
                  as='button'
                  className='text-2xl'
                  image='button'
                  type='submit'
                  disabled={isPending}
                >
                  Change password
                </ButtonWithAudio>
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export { Profile }
