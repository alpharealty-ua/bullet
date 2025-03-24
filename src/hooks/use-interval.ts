import { useEffect, useRef } from 'react'

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const func = () => {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setInterval(func, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export { useInterval }
