import { useRef, useState, ComponentProps, useEffect } from 'react'

import { useSettingsStore } from '@/store/settings.store'
import { useInterval } from '@/hooks/use-interval'
import { cn } from '@/lib/utils'

type CountdownProps = ComponentProps<'div'> & {
  time: number
  mute?: boolean
  onEnd?: () => void
}

const Countdown = ({
  className,
  time,
  onEnd,
  mute,
  ...props
}: CountdownProps) => {
  const getSound = useSettingsStore(({ getSound }) => getSound)
  const [currentTime, setTime] = useState(time)
  const [, forceUdate] = useState(false)
  const timeRef = useRef(time)
  const audioElRef = useRef(getSound('timer'))

  const countdown = () => {
    const time = --timeRef.current
    setTime(time)

    if (time === -1) {
      onEnd && onEnd()
      setTime(0)
      // need force becouse is changed time 0 => 0
      forceUdate((p) => !p)
      if (mute) {
        getSound('negativebeeps').play()
        audioElRef.current.pause()
      }
      return
    }
  }

  useEffect(() => {
    if (!mute) {
      return
    }

    const audioEl = audioElRef.current
    audioEl.volume = 0.5
    audioEl.loop = true
    audioEl.play()

    return () => {
      audioEl.pause()
    }
  }, [getSound, mute])

  useInterval(countdown, timeRef.current !== -1 ? 1000 : null)

  return (
    <div
      className={cn(
        'text-red inline-flex justify-center text-center text-xl',
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
