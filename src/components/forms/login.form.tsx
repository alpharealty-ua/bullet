import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  code: z.string().optional(),
})

type LoginSchema = z.infer<typeof loginSchema>

export const Login = () => {
  const [isPending] = useTransition()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
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
