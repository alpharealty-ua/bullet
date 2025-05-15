import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useLogin } from '@/api/auth.api'
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

const ChangePasswordForm = () => {
  const { error: mutationError, isPending } = useLogin()
  const [isSubmitSuccess, setIsSuccess] = useState(false)

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      passwordConfirm: '',
    },
  })

  const handleChangePasswordSubmit = async (values: ChangePasswordSchema) => {
    console.log(values)
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
    }, 1000)
    form.reset()
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='px-2'>Change password</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleChangePasswordSubmit)}
          className='mx-auto flex w-full max-w-80 flex-col gap-4 px-2'
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
          <Notification type='error' message={mutationError?.message} />
          <ButtonWithAudio
            as='button'
            className='text-2xl'
            image='button'
            type='submit'
            disabled={isPending}
          >
            Change password
          </ButtonWithAudio>
        </form>
      </Form>
    </div>
  )
}

export { ChangePasswordForm }
