import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { useLogin } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { loginSchema, LoginSchema } from '@/lib/schemas/login.schema'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormInputPassword,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Notification } from '@/components/ui/notification'
import { ChangeForm } from '@/components/ui/change-form'

const LoginForm = () => {
  const { mutateAsync: loginMutation, error, isPending, isSuccess } = useLogin()
  const navigate = useNavigate()
  const { state = { redirect: ROUTES.index } } = useLocation()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: import.meta.env.BULLET_TEST_LOGIN ?? '',
      password: import.meta.env.BULLET_TEST_PASSWORD ?? '',
    },
  })

  const onSubmit = async (values: LoginSchema) => {
    await loginMutation(values)
    setTimeout(
      () =>
        navigate(state.redirect, { state: { ...state, redirect: undefined } }),
      1000,
    )
  }

  return (
    <div className='relative flex grow-1 flex-col items-center gap-8 p-10'>
      <h3 className='text-5xl'>Login</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex w-full flex-col gap-4'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field: { disabled, ...field } }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <FormInput
                    placeholder='Email'
                    disabled={disabled || isPending}
                    type='email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Notification
            type='success'
            message={isSuccess ? 'You have successfully logged in.' : ''}
          />
          <Notification type='error' message={error?.message} />
          <Button text='Login' type='submit' disabled={isPending} />
          <ChangeForm type='login' />
        </form>
      </Form>
    </div>
  )
}

export { LoginForm }
