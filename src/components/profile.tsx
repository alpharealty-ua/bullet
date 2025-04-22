import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { QUERY_KEYS } from '@/api/api'
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
import { Loading } from '@/components/loading'
import { RequestError } from '@/components/request-error'

// TODO: MOVE FETCH USE TO COMPONENT
interface ProfileProps {
  user: UserSchema
}

const Profile = ({ user }: ProfileProps) => {
  const queryClient = useQueryClient()
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
    await queryClient.setQueryData([QUERY_KEYS.profile], null)
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
            <table className='w-full divide-y divide-gray-200 text-center text-sm'>
              <tbody>
                <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                  <td className='px-2 py-3 font-semibold text-gray-500'>
                    Record
                  </td>
                  <td className='px-2 py-3 font-medium'>
                    <span className='text-green-600'>
                      {playerStatistics.gamesWon}W
                    </span>
                    /
                    <span className='text-red-600'>
                      {playerStatistics.gamesLost}L
                    </span>
                  </td>
                </tr>
                {[
                  {
                    label: 'Username',
                    value: user.username,
                  },
                  {
                    label: 'Email',
                    value: user.email,
                  },
                  {
                    label: 'Total games',
                    value: playerStatistics.totalGames,
                  },
                  {
                    label: 'Win rate',
                    value: playerStatistics.winRate,
                  },
                  {
                    label: 'Lvl',
                    value: playerStatistics.lvl,
                  },
                  {
                    label: 'Percentile',
                    value: playerStatistics.percentile,
                  },
                  {
                    label: 'Perfect Hit %',
                    value: playerStatistics.perfectHitRate,
                  },
                  {
                    label: 'Rank',
                    value: playerStatistics.rank,
                  },
                ].map(({ label, value }, i) => (
                  <tr
                    key={i}
                    className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'
                  >
                    <td className='px-2 py-3 font-semibold text-gray-500'>
                      {label}
                    </td>
                    <td className='px-2 py-3'>
                      {typeof value === 'number'
                        ? Number(value.toFixed(2))
                        : value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
