import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'

import { useLogin } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { loginSchema, LoginSchema } from '@/lib/schemas/login.schema'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
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
import { GoogleLoginButton } from '@/components/ui/google-login-button'

const LoginForm = () => {
  const { mutateAsync: loginMutation, error, isPending, isSuccess } = useLogin()
  const navigate = useNavigate()
  const { state } = useLocation()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: import.meta.env.BULLET_TEST_LOGIN ?? '',
      password: import.meta.env.BULLET_TEST_PASSWORD ?? '',
    },
  })

  const onSubmit = async (values: LoginSchema) => {
    await loginMutation(values)
    const redirect = state?.redirect ?? ROUTES.root
    setTimeout(() => {
      navigate(redirect, { state: { ...state, redirect: undefined } })
    }, 1000)
  }

  return (
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
        <ButtonWithAudio
          as='button'
          image='button'
          text='Login'
          type='submit'
          disabled={isPending}
        />
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <GoogleLoginButton />
        <ChangeForm type='forgotPassword' />
        <ChangeForm type='login' />
      </form>
    </Form>
  )
}

export { LoginForm }
