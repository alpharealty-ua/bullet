import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { QUERY_KEYS } from '@/api/api'
import { useLogin, useUser } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import {
  ChangePasswordSchema,
  changePasswordSchema,
} from '@/lib/schemas/change-password.schema'
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

const Profile = () => {
  const queryClient = useQueryClient()
  const user = useUser()
  const { error, isPending } = useLogin()
  const [isSuccess, setIsSuccess] = useState(false)
  const resetToken = useAuthStore(({ resetToken }) => resetToken)

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  })

  const handleLogout = async () => {
    resetToken()
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
      <div className='flex flex-col gap-5 p-4'>
        <h3 className='text-center text-3xl'>Profile page</h3>
        <div className='flex flex-col gap-2 text-lg'>
          {[
            ['Email', user.email],
            ['Name', user.name],
            ['Username', user.username],
            ['LVL', '53'],
            ['Precision', '55'],
            ['Consistency', '48'],
            ['Speed', '56'],
            ['W/L', '142W / 128L'],
          ].map(([label, value], i) => {
            return (
              <div key={i} className='flex justify-between gap-4'>
                <div className='text-gray-500'>{label}:</div>
                <div className='overflow-hidden text-ellipsis'>{value}</div>
              </div>
            )
          })}
          <div className='flex justify-between gap-2'>
            <div className='text-gray-500'>Status:</div>
            <div className='text-green'>{user.status}</div>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleChangePasswordSubmit)}
            className='flex w-full flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='password'
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
              message={isSuccess ? 'Password updated!' : ''}
            />
            <Notification type='error' message={error?.message} />
            <ButtonWithAudio
              as='button'
              className='text-2xl'
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
    </>
  )
}

export { Profile }
