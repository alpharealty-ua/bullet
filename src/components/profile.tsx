import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useLogin, useUser } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import {
  ChangePasswordSchema,
  changePasswordSchema,
} from '@/lib/schemas/change-password.schema'
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
import { PlayerFriends } from './player/player-friends'

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
          <PlayerFriends />
        </TabsContent>
        <TabsContent
          value='changePassword'
          className='flex grow flex-col gap-2'
        >
          <div className='flex flex-col gap-6'>
            <div className='px-2'>Change password</div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleChangePasswordSubmit)}
                className='mx-auto flex w-full max-w-80 flex-col gap-4 px-2'
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
