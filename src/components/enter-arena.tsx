import { useEffect, useState } from 'react'
import { IoPlay } from 'react-icons/io5'

import { IMAGES } from '@/lib/constants'
import { cn, onlyDigit } from '@/lib/utils'

const EnterArena = ({
  onSearch,
}: {
  onSearch: (searched: boolean) => void
}) => {
  const [isSearching, setIsSearching] = useState(false)
  const [value, setValue] = useState<number | null>(null)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    const input = form.querySelector('[data-value]') as HTMLInputElement

    if (input === null) {
      return
    }

    const value = input.value

    if (value === '') {
      return
    }

    setIsSearching((p) => !p)
    setValue(Number(value))
  }

  useEffect(() => {
    if (!isSearching) {
      return
    }

    const timeoutID = setTimeout(() => {
      onSearch(true)
    }, 3000)

    return () => {
      clearTimeout(timeoutID)
    }
  }, [isSearching, value, onSearch])

  return (
    <div className='relative mx-auto flex w-full max-w-46 flex-col items-center justify-center gap-2 pt-14'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <button className='hover:text-green cursor-pointer text-2xl transition-all'>
          Enter arena
        </button>
        <div
          className={cn(
            'relative flex aspect-[1/0.312] w-full items-center justify-between gap-2 bg-contain bg-center bg-no-repeat px-2.5 pl-5 text-2xl',
            'repeat-infinite direction-alternate duration-500 ease-linear',
            isSearching && 'animate-[pulse-enter-arena]',
          )}
          style={{ backgroundImage: `url(${IMAGES.enterarena})` }}
        >
          <div className='flex grow items-center gap-1'>
            <div className={cn('shrink-0', isSearching && 'opacity-75')}>$</div>
            <input
              className='h-10 w-full bg-transparent outline-none disabled:opacity-75'
              defaultValue='1000'
              type='number'
              disabled
              autoFocus
              data-value
            />
          </div>
          <button
            className={cn(
              'relative -top-0.5 flex h-13 w-7 shrink-0 cursor-pointer items-center justify-center font-bold opacity-100 transition-colors [&:hover_span]:scale-110',
              isSearching &&
                'text-red hover:bg-red/10 active:bg-red/20 text-xl select-none',
              !isSearching &&
                'text-green hover:bg-green/10 active:bg-green/20 text-2xl select-none',
            )}
          >
            <span className='transition-transform'>
              {isSearching ? 'X' : <IoPlay />}
            </span>
          </button>
        </div>
      </form>
      {isSearching && (
        <div className={cn('px-3', 'animate-in fade-in duration-500')}>
          Searching for opponent{' '}
          <span className='repeat-infinite direction-alternate inline-block animate-[period-pulse] rounded-full align-bottom delay-0 duration-400 ease-linear'>
            .
          </span>
          <span className='repeat-infinite direction-alternate inline-block animate-[period-pulse] rounded-full align-bottom delay-200 duration-400 ease-linear'>
            .
          </span>
          <span className='repeat-infinite direction-alternate inline-block animate-[period-pulse] rounded-full align-bottom delay-400 duration-400 ease-linear'>
            .
          </span>
        </div>
      )}
    </div>
  )
}

export { EnterArena }
