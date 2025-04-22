import { createPortal } from 'react-dom'

import { getItem } from '@/lib/localstorage'
import { useForm } from 'react-hook-form'

import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const Debug = () => {
  // TODO: ADD STORE
  const form = useForm({
    defaultValues: {
      startCountDown: '5',
    },
  })

  if (!getItem('showDebug')) {
    return null
  }

  const onSubmit = () => {}

  return createPortal(
    <div className='absolute top-0 right-[calc(50%+var(--width)/2)] flex w-50 flex-col gap-2 bg-amber-100 p-4'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex w-full flex-col gap-4'
        >
          <FormField
            control={form.control}
            name='startCountDown'
            render={({ field: { disabled, ...field } }) => (
              <FormItem>
                <FormLabel>Duel start countdown</FormLabel>
                <FormControl>
                  <FormInput
                    placeholder='5'
                    disabled={disabled}
                    type='email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ButtonWithAudio
            as='button'
            image='button'
            text='Apply'
            type='submit'
            className='text-xl'
          />
        </form>
      </Form>
    </div>,
    document.body,
  )
}

export { Debug }
