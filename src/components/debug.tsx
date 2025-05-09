import { useEffect, useRef, useState } from 'react'
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
import { setItem } from '@/lib/localstorage'
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
import { duelEvents, matchmakerEvents } from '@/socket/socket'
import { MatchmakerEventList } from '@/socket/matchmaker/matchmaker-socket-events'
import { DuelEventList } from '@/socket/duel/duel-socket-events'

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
  const wrapperRef = useRef<HTMLDivElement>(null)
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

  const [matchmakerList, setMathcmakerEvents] = useState<MatchmakerEventList[]>(
    [],
  )
  const [duelList, setDuelEvents] = useState<DuelEventList[]>([])

  useEffect(() => {
    const matchmakerEl = wrapperRef.current?.querySelector(
      '[data-matchmaker]',
    ) as HTMLDivElement
    const duelEl = wrapperRef.current?.querySelector(
      '[data-duel]',
    ) as HTMLDivElement

    if (matchmakerEl == null || duelEl == null) {
      return
    }

    const handleMatchmakerEvents = (events: MatchmakerEventList) => {
      setMathcmakerEvents((p) => [...p, events])

      requestAnimationFrame(() => {
        if (
          matchmakerEl.scrollTop + matchmakerEl.offsetHeight + 80 >
          matchmakerEl.scrollHeight
        ) {
          matchmakerEl.scrollTop = matchmakerEl.scrollHeight
        }
      })
    }

    const handleDuelEvents = (events: DuelEventList) => {
      setDuelEvents((p) => [...p, events])

      requestAnimationFrame(() => {
        if (duelEl.scrollTop + duelEl.offsetHeight + 80 > duelEl.scrollHeight) {
          duelEl.scrollTop = duelEl.scrollHeight
        }
      })
    }

    matchmakerEvents.addEventsListener(handleMatchmakerEvents)
    duelEvents.addEventsListener(handleDuelEvents)

    return () => {
      matchmakerEvents.removeEventsListener(handleMatchmakerEvents)
      duelEvents.removeEventsListener(handleDuelEvents)
    }
  }, [])

  return createPortal(
    <div
      ref={wrapperRef}
      className='absolute top-0 right-[calc(50%+var(--width)/2)] flex w-100 gap-2 overflow-hidden bg-amber-100 p-4'
    >
      <div className='w-1/2 shrink-0'>
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
      </div>
      <div className='flex grow flex-col gap-10 overflow-hidden'>
        <div
          className='custom-scroll flex max-h-50 flex-col gap-2 overflow-x-hidden bg-white p-2'
          data-matchmaker
        >
          {matchmakerList.map((el, i) => (
            <div key={i} className='flex gap-2'>
              <div>{el.type}</div>
            </div>
          ))}
        </div>
        <div
          className='custom-scroll flex max-h-50 flex-col gap-2 overflow-x-hidden bg-white p-2'
          data-duel
        >
          {duelList.map((el, i) => (
            <div key={i} className='flex gap-2'>
              <div>{el.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export { Debug }
