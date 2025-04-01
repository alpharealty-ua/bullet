import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useResetPassword } from '@/api/auth.api'
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
import { ChangeForm } from '@/components/ui/change-form'
import { resetPasswordSchema, ResetPasswordSchema } from '@/lib/schemas/reset-password.schema.ts'
import { useNavigate, useSearchParams } from 'react-router'
import { ROUTES } from '@/routes/path.tsx'

const ResetPasswordForm = () => {
  const { mutateAsync: resetPasswordMutation, error, isPending, isSuccess, data } = useResetPassword()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: searchParams.get('token') || '',
      newPassword: '',
      passwordConfirm: '',
    },
  })

  const onSubmit = async (values: ResetPasswordSchema) => {
    await resetPasswordMutation(values)

    const redirect = ROUTES.auth.login
    setTimeout(() => {
      navigate(redirect, { state: { redirect: undefined } })
    }, 1000)
  }

  return (
    <div className='relative flex w-full flex-col items-center gap-8'>
      <h3 className='text-3xl'>Reset Password</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
            message={isSuccess ? data?.message : ''}
          />
          <Notification type='error' message={error?.message} />
          <ButtonWithAudio
            as='button'
            image='button'
            text='Reset'
            type='submit'
            disabled={isPending}
          />
          <ChangeForm type='register' />
        </form>
      </Form>
    </div>
  )
}

export { ResetPasswordForm }
