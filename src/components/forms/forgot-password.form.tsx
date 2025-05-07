import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useForgotPassword } from '@/api/auth.api'
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from '@/lib/schemas/forgot-password.schema.ts'
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Notification } from '@/components/ui/notification'
import { ChangeForm } from '@/components/ui/change-form'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const ForgotPasswordForm = () => {
  const {
    mutateAsync: forgotPasswordMutation,
    error,
    isPending,
    isSuccess,
    data,
  } = useForgotPassword()

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: import.meta.env.BULLET_TEST_LOGIN ?? '',
    },
  })

  const onSubmit = async (values: ForgotPasswordSchema) => {
    await forgotPasswordMutation(values)
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
        <Notification type='success' message={isSuccess ? data?.message : ''} />
        <Notification type='error' message={error?.message} />
        <ButtonWithAudio
          as='button'
          image='button'
          type='submit'
          disabled={isPending}
        >
          {' '}
          Reset
        </ButtonWithAudio>
        <ChangeForm type='register' />
      </form>
    </Form>
  )
}

export { ForgotPasswordForm }
