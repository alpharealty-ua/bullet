import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

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

export const Login = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: loginMutation, error, isPending } = useLogin(queryClient)
  const navigate = useNavigate()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: import.meta.env.BULLET_TEST_LOGIN ?? '',
      password: import.meta.env.BULLET_TEST_PASSWORD ?? '',
    },
  })

  const onSubmit = async (values: LoginSchema) => {
    await loginMutation(values)
    navigate(ROUTES.index)
  }

  return (
    <div className='relative flex grow-1 flex-col items-center justify-center gap-3 p-10'>
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
                <FormLabel>Login</FormLabel>
                <FormControl>
                  <FormInput
                    placeholder='Login'
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
          <Button text='Login' type='submit' />
          {error && (
            <div className='text-red-500'>
              An error has occurred: {error.message}
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}
