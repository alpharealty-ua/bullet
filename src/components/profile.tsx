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

// TODO: MOVE FETCH USE TO COMPONENT
interface ProfileProps {
  user: UserSchema
}

const Profile = ({ user }: ProfileProps) => {
  const queryClient = useQueryClient()
  const { error, isPending } = useLogin()
  const [isSubmitSuccess, setIsSuccess] = useState(false)
  const resetTokens = useAuthStore(({ resetTokens }) => resetTokens)

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      passwordConfirm: '',
    },
  })

  const {
    data: playerStatistics,
    isLoading,
    isSuccess,
  } = usePlayerStatistics(user.id)

  if (isLoading) {
    return <Loading />
  }

  if (!isSuccess) {
    return (
      <Notification type='error' message='Failed to load player statistics' />
    )
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
      <div className='flex flex-col gap-5'>
        <div className='cuctom-scroll'>
          <table className='w-full divide-y divide-gray-200 text-center text-sm'>
            <tbody>
              <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                <td className='px-2 py-3 font-semibold text-gray-500'>Email</td>
                <td className='px-2 py-3'>{user.email}</td>
              </tr>
              <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                <td className='px-2 py-3 font-semibold text-gray-500'>
                  Username
                </td>
                <td className='px-2 py-3'>{user.username}</td>
              </tr>
              <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                <td className='px-2 py-3 font-semibold text-gray-500'>
                  Status
                </td>
                <td className='px-2 py-3'>{user.status}</td>
              </tr>
              <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                <td className='px-2 py-3 font-semibold text-gray-500'>
                  Country
                </td>
                <td className='px-2 py-3'>{playerStatistics.country}</td>
              </tr>
              <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                <td className='px-2 py-3 font-semibold text-gray-500'>Rank</td>
                <td className='px-2 py-3'>{playerStatistics.rank}</td>
              </tr>
              <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                <td className='px-2 py-3 font-semibold text-gray-500'>Level</td>
                <td className='px-2 py-3'>{playerStatistics.lvl}</td>
              </tr>
              <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                <td className='px-2 py-3 font-semibold text-gray-500'>
                  Precision
                </td>
                <td className='px-2 py-3'>{playerStatistics.precision}</td>
              </tr>
              <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                <td className='px-2 py-3 font-semibold text-gray-500'>
                  Perfect Hit %
                </td>
                <td className='px-2 py-3'>
                  {playerStatistics.perfectHitRate}%
                </td>
              </tr>
              <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                <td className='px-2 py-3 font-semibold text-gray-500'>Speed</td>
                <td className='px-2 py-3'>{playerStatistics.speedAdapt}</td>
              </tr>
              <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                <td className='px-2 py-3 font-semibold text-gray-500'>
                  Total games
                </td>
                <td className='px-2 py-3'>{playerStatistics.totalGames}</td>
              </tr>
              <tr className='bg-white text-left duration-150 even:bg-gray-50 hover:bg-blue-50'>
                <td className='px-2 py-3 font-semibold text-gray-500'>
                  Win rate
                </td>
                <td className='px-2 py-3'>{playerStatistics.winRate}%</td>
              </tr>
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
            </tbody>
          </table>
        </div>
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
              <Notification type='error' message={error?.message} />
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
          <ButtonWithAudio
            as='button'
            className='self-center'
            text='logout'
            bg='red'
            onClick={handleLogout}
          />
        </div>
      </div>
    </>
  )
}

export { Profile }
