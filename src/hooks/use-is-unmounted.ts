import { useEffect, useRef } from 'react'

export const useInUnmounted = () => {
  const isUnmounted = useRef(false)

  useEffect(() => {
    isUnmounted.current = false

    return () => {
      isUnmounted.current = true
    }
  }, [])

  return isUnmounted
}
