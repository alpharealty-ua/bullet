import { useRef, useState, ComponentProps } from 'react'

import { useInterval } from '@/hooks/use-interval'
import { cn } from '@/lib/utils'

type CountdownProps = ComponentProps<'div'> & {
  time: number
  onEnd?: () => void
}

const Countdown = ({ className, time, onEnd, ...props }: CountdownProps) => {
  const [currentTime, setTime] = useState(time)
  const timeRef = useRef(time)

  const countdown = () => {
    if (timeRef.current === 0) {
      onEnd && onEnd()
      setTime(0)
      return
    }
    setTime(--timeRef.current)
  }

  useInterval(countdown, timeRef.current > -1 ? 1000 : null)

  return (
    <div
      className={cn(
        'text-red inline-flex text-xl',
        'repeat-infinite direction-alternate animate-[pulse-time] duration-500 will-change-contents',
        className,
      )}
      {...props}
    >
      {currentTime}
    </div>
  )
}

export { Countdown }
