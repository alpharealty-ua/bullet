import { useCallback, useEffect, useRef } from 'react'

const useUnmountedState = () => {
  const unmountedRef = useRef(false)
  const isUnmounted = useCallback(() => unmountedRef.current, [])

  useEffect(() => {
    unmountedRef.current = false

    return () => {
      unmountedRef.current = true
    }
  }, [])

  return isUnmounted
}

export { useUnmountedState }
