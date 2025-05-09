import { createPortal } from 'react-dom'

import { useForm } from 'react-hook-form'

import { useAddBalance } from '@/api/wallet.api'
import {
  AFK_TIME,
  BET_AMOUNT,
  DUEL_COUNTDOWN,
  MAX_BET,
  MAX_ROUNDS,
  MIN_DUEL_BET,
} from '@/lib/constants'
import { getItem, setItem } from '@/lib/localstorage'
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

type FormValues = {
  duelCoundDown: string
  minDuelBet: string
  maxBet: string
  afkTime: string
  maxRounds: string
  betAmount: string
}

// TODO: ADD SOCKET EVENTS
const Debug = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      duelCoundDown: String(DUEL_COUNTDOWN),
      minDuelBet: String(MIN_DUEL_BET),
      maxBet: String(MAX_BET),
      afkTime: String(AFK_TIME),
      maxRounds: String(MAX_ROUNDS),
      betAmount: String(BET_AMOUNT),
    },
  })

  const { mutate: addBalanceMutation } = useAddBalance()

  const handleSubmit = (values: FormValues) => {
    setItem('duelCoundDown', values.duelCoundDown)
    setItem('minDuelBet', values.minDuelBet)
    setItem('maxBet', values.maxBet)
    setItem('afkTime', values.afkTime)
    setItem('maxRounds', values.maxRounds)
    setItem('betAmount', values.betAmount)

    location.reload()
  }

  const handleAddMoneyClick = () => {
    addBalanceMutation(1000)
  }

  return createPortal(
    <div className='absolute top-0 right-[calc(50%+var(--width)/2)] flex w-50 flex-col gap-2 bg-amber-100 p-4'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='flex w-full flex-col gap-4'
        >
          <FormField
            control={form.control}
            name='duelCoundDown'
            render={({ field: { disabled, ...field } }) => (
              <FormItem>
                <FormLabel>Duel start countdown</FormLabel>
                <FormControl>
                  <FormInput
                    className='h-10'
                    disabled={disabled}
                    type='number'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='minDuelBet'
            render={({ field: { disabled, ...field } }) => (
              <FormItem>
                <FormLabel>Min duel bet</FormLabel>
                <FormControl>
                  <FormInput
                    className='h-10'
                    disabled={disabled}
                    type='number'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='maxBet'
            render={({ field: { disabled, ...field } }) => (
              <FormItem>
                <FormLabel>Max bet</FormLabel>
                <FormControl>
                  <FormInput
                    className='h-10'
                    disabled={disabled}
                    type='number'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='afkTime'
            render={({ field: { disabled, ...field } }) => (
              <FormItem>
                <FormLabel>Afk time</FormLabel>
                <FormControl>
                  <FormInput
                    className='h-10'
                    disabled={disabled}
                    type='number'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='maxRounds'
            render={({ field: { disabled, ...field } }) => (
              <FormItem>
                <FormLabel>Max rounds</FormLabel>
                <FormControl>
                  <FormInput
                    className='h-10'
                    disabled={disabled}
                    type='number'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='betAmount'
            render={({ field: { disabled, ...field } }) => (
              <FormItem>
                <FormLabel>Bet amounds</FormLabel>
                <FormControl>
                  <FormInput
                    className='h-10'
                    disabled={disabled}
                    type='number'
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
            type='submit'
            className='text-xl'
          >
            Apply
          </ButtonWithAudio>
        </form>
      </Form>
      <ButtonWithAudio
        as='button'
        image='button'
        className='text-xl'
        onClick={handleAddMoneyClick}
      >
        Add money
      </ButtonWithAudio>
    </div>,
    document.body,
  )
}

export { Debug }
