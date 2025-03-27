import { useRef, useState } from 'react'

import { useInterval } from '@/hooks/use-interval'
import { cn } from '@/lib/utils'

const Countdown = ({ time, onEnd }: { time: number; onEnd: () => void }) => {
  const [currentTime, setTime] = useState(time)
  const timeRef = useRef(time)

  const countdown = () => {
    if (timeRef.current === 0) {
      onEnd()
      setTime(0)
      return
    }
    setTime(--timeRef.current)
  }

  useInterval(countdown, timeRef.current > -1 ? 1000 : null)

  return (
    <div
      className={cn(
        'text-red text-7xl',
        'repeat-infinite animate-[pulse-time] duration-500',
      )}
    >
      {currentTime}
    </div>
  )
}

export { Countdown }
