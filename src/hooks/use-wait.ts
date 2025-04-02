import { useCallback, useEffect, useRef } from 'react'

import { wait } from '@/lib/utils'

const useWait = () => {
  const timeoutIds = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach(clearTimeout)
    }
  }, [])

  return useCallback(async (...args: Parameters<typeof wait>) => {
    const { promise, timeoutId } = wait(...args)
    timeoutIds.current.push(timeoutId)

    return promise.then(() => {
      timeoutIds.current = timeoutIds.current.filter((id) => id !== timeoutId)
    })
  }, [])
}

export { useWait }
