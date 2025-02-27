import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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
  const [isPending] = useTransition()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: import.meta.env.BULLET_TEST_LOGIN,
      password: import.meta.env.BULLET_TEST_PASSWORD,
    },
  })

  const onSubmit = async (values: LoginSchema) => {
    console.log(values)

    fetch('https://api-dev.bullet.game/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }).catch((e) => {
      console.log(e)
    })
  }

  return (
    <div className='relative flex grow-1 flex-col items-center justify-center p-10'>
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
          <Button type='submit' text='submit' />
        </form>
      </Form>
    </div>
  )
}
