import { cn } from '@/lib/utils'
import { useIncreaseNumber } from '@/hooks/use-increase-number'

// TODO: MOVE TO CONSTANTS
const TIME_WIN_AUDIO = 3500
const TIME_ANIMATION_DELAY = 200
const TIME_ANIMATION_DURATION = 500
const TIME_INCREASE =
  TIME_WIN_AUDIO - TIME_ANIMATION_DURATION - TIME_ANIMATION_DELAY

const Balance = ({
  value,
  beforeSlot,
}: {
  value: number
  beforeSlot?: React.ReactNode
}) => {
  const { totalRef, winRef } = useIncreaseNumber({
    value,
    increaseTime: TIME_INCREASE,
    decreaseTime: 500,
  })

  return (
    <div className='flex gap-1'>
      {beforeSlot}
      <div className='relative flex flex-col'>
        <div className='text-center text-2xl leading-[1] tracking-tight text-[#006100] uppercase'>
          Balance
        </div>
        <div
          ref={totalRef}
          className='flex justify-center text-center text-3xl leading-[1] tracking-tight'
        >
          $<div data-value></div>
        </div>
        <div
          ref={winRef}
          className={cn(
            'fill-mode-both absolute top-full right-0 left-0 hidden justify-center text-center text-3xl leading-[1] tracking-tight duration-500',
            '[&.is-in]:animate-in [&.is-in]:fade-in [&.is-in]:slide-in-from-bottom-10 [&.is-in]:flex [&.is-in.is-increase]:delay-200',
            '[&.is-out]:animate-out [&.is-out]:fade-out [&.is-out]:flex',
            '[&.is-increase]:text-[#006100]',
            '[&.is-decrease]:text-[#ff0b0b]',
          )}
        >
          <div className='hidden font-bold [.is-increase_&]:block'>+</div>
          <div className='hidden font-bold [.is-decrease_&]:block'>-</div>
          <div>$</div>
          <div data-value></div>
        </div>
      </div>
    </div>
  )
}

export { Balance }
