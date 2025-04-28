import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { usePlayerStatistics } from '@/api/leaderboard.api'
import { useLogin } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import {
  ChangePasswordSchema,
  changePasswordSchema,
} from '@/lib/schemas/change-password.schema'
import { UserSchema } from '@/lib/schemas/auth.schema'
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
import { Loading } from '@/components/ui/loading'
import { RequestError } from '@/components/ui/request-error'
import { PlayerStatistics } from '@/components/leaderboard/player-statistics'

// TODO: MOVE FETCH USE TO COMPONENT
interface ProfileProps {
  user: UserSchema
}

const Profile = ({ user }: ProfileProps) => {
  const {
    data: playerStatistics,
    isLoading,
    isSuccess,
    error,
  } = usePlayerStatistics(user.id)
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

  if (isLoading) {
    return <Loading />
  }

  if (!isSuccess) {
    return <RequestError error={error} />
  }

  const handleLogout = async () => {
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
      <Tabs
        className='flex shrink-0 grow flex-col overflow-hidden'
        defaultValue='personalStatistics'
      >
        <TabsList>
          <TabsTrigger value='personalStatistics'>
            Personal statistics
          </TabsTrigger>
          <TabsTrigger value='changePassword'>Change password</TabsTrigger>
        </TabsList>
        <TabsContent
          value='personalStatistics'
          className='flex grow flex-col gap-6'
        >
          <div className='cuctom-scroll'>
            <PlayerStatistics list={playerStatistics} user={user} />
          </div>
          <ButtonWithAudio
            as='button'
            className='self-center'
            text='logout'
            bg='red'
            onClick={handleLogout}
          />
        </TabsContent>
        <TabsContent
          value='changePassword'
          className='flex grow flex-col gap-6'
        >
          <div className='flex flex-col items-center gap-4 p-4'>
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
                  text='Change password'
                  type='submit'
                  disabled={isPending}
                />
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export { Profile }
