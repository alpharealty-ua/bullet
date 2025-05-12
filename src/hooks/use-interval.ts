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

    let intervalID: number

    if (delay !== null) {
      intervalID = window.setInterval(func, delay)
    }

    return () => clearInterval(intervalID)
  }, [delay])
}

export { useInterval }
