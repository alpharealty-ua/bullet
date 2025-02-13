import { useRef, useEffect } from 'react'

export const useIncreaseNumber = (value: number, ...deps: unknown[]) => {
  const textRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef(value)

  useEffect(() => {
    const textDom = textRef.current

    if (textDom === null) {
      return
    }

    const prevVal = valueRef.current
    valueRef.current = value

    if (prevVal === value) {
      textDom.textContent = `${value}`
      return
    }

    let currentValue = prevVal

    const TIME_FRAME = 16
    const TOTAL_TIME = 400
    const COUNT = TOTAL_TIME / TIME_FRAME

    const delta = value - currentValue
    const sign = delta > 0 ? 1 : -1

    const intervalValue = (delta / COUNT) ^ 0 || sign

    let requestID = requestAnimationFrame(function addNumber() {
      textDom.textContent = `${(currentValue += intervalValue)}`
      if (currentValue * sign >= value * sign) {
        textDom.textContent = `${value}`
        return
      }
      requestID = requestAnimationFrame(addNumber)
    })

    return () => {
      textDom.textContent = `${value}`
      cancelAnimationFrame(requestID)
    }
  }, [value, ...deps])

  return { textRef }
}
