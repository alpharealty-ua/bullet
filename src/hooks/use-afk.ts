import { useCallback, useEffect, useRef } from 'react'

import { AFK_TIME } from '@/lib/constants'

const events = ['pointerdown', 'pointermove', 'wheel', 'keydown', 'scroll']

const useAfk = () => {
  const isAfkRef = useRef(false)
  const lastActiveRef = useRef(Date.now())
  const isAfk = useCallback(() => isAfkRef.current, [])

  useEffect(() => {
    const cb = () => {
      lastActiveRef.current = Date.now()
    }

    events.forEach((event) =>
      window.addEventListener(event, cb, { passive: true }),
    )

    return () => {
      events.forEach((event) => window.removeEventListener(event, cb))
    }
  }, [])

  useEffect(() => {
    const intervalID = setInterval(() => {
      const lastActive = lastActiveRef.current
      const notActiveTime = Date.now() - lastActive
      const isAfk = notActiveTime > AFK_TIME
      isAfkRef.current = isAfk
    }, 1000)

    return () => {
      clearInterval(intervalID)
    }
  }, [])

  return isAfk
}

export { useAfk }
