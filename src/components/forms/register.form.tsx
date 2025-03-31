import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { useRegister } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { registerSchema, RegisterSchema } from '@/lib/schemas/register.schema'
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

const RegisterForm = () => {
  const {
    mutateAsync: registerMutation,
    error,
    isPending,
    isSuccess,
  } = useRegister()
  const navigate = useNavigate()

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  })

  const onSubmit = async (values: RegisterSchema) => {
    await registerMutation(values)
    setTimeout(() => navigate(ROUTES.auth.login), 1000)
  }

  return (
    <div className='relative flex w-full flex-col items-center gap-8'>
      <h3 className='text-3xl'>Register</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex w-full flex-col gap-4'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field: { disabled, ...field } }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <FormInput
                    placeholder='Name'
                    disabled={disabled || isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='username'
            render={({ field: { disabled, ...field } }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <FormInput
                    placeholder='Username'
                    disabled={disabled || isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    placeholder='******'
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
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <FormInputPassword
                    placeholder='******'
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
            message={isSuccess ? 'You have successfully registered.' : ''}
          />
          <Notification type='error' message={error?.message} />
          <ButtonWithAudio
            as='button'
            image='button'
            text='Register'
            type='submit'
            disabled={isPending}
          />
          <ChangeForm type='register' />
        </form>
      </Form>
    </div>
  )
}

export { RegisterForm }
