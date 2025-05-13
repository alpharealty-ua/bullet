import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useLogin } from '@/api/auth.api'
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
import { MatchmakerPersonalRecentGames } from './matchmaker/matchmaker-recent-games'
import { MatchmakerPersonalStatistics } from './matchmaker/matchmaker-personal-statistics'

const Profile = () => {
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
          <TabsTrigger value='changePassword'>Change password</TabsTrigger>
        </TabsList>
        <TabsContent
          value='personalStatistics'
          className='flex grow flex-col gap-6 overflow-hidden'
        >
          <MatchmakerPersonalStatistics />
          <MatchmakerPersonalRecentGames />
          <ButtonWithAudio
            as='button'
            className='self-center'
            bg='red'
            onClick={handleLogout}
          >
            logout
          </ButtonWithAudio>
        </TabsContent>
        <TabsContent
          value='changePassword'
          className='flex grow flex-col gap-6'
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
