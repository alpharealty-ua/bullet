import { wait } from '@/lib/utils'
import { useRef, useEffect } from 'react'

export const useIncreaseNumber = (value: number) => {
  const textRef = useRef<HTMLDivElement>(null)
  const winRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef(value)

  useEffect(() => {
    const textDom = textRef.current
    const winDom = winRef.current

    if (textDom === null || winDom === null) {
      return
    }

    const prevVal = valueRef.current
    valueRef.current = value

    if (prevVal === value) {
      textDom.textContent = `${value}`
      winDom.textContent = '0'
      return
    }

    let currentValue = prevVal
    const deltaValue = value - currentValue

    const TIME_FRAME = 16
    const TOTAL_TIME = deltaValue > 0 ? 1000 : 100
    const COUNT = TOTAL_TIME / TIME_FRAME

    const sign = deltaValue > 0 ? 1 : -1

    const intervalValue = (deltaValue / COUNT) ^ 0 || sign

    const winValue = deltaValue
    winDom.textContent = `${winValue}`

    winDom.classList.add('is-in')
    winDom.classList.remove('is-out')

    let requestID = -1
    let isUnmounted = false
    const animationend = async (event: AnimationEvent) => {
      await wait(50)

      if (isUnmounted) {
        return
      }

      if (event.animationName === 'enter') {
        requestID = requestAnimationFrame(function addNumber() {
          currentValue += intervalValue
          if (currentValue * sign >= value * sign) {
            textDom.textContent = `${value}`
            winDom.textContent = '0'
            winDom.classList.remove('is-in')
            winDom.classList.add('is-out')
            return
          }

          textDom.textContent = `${currentValue}`
          winDom.textContent = `${value - currentValue}`
          requestID = requestAnimationFrame(addNumber)
        })
      }
      if (event.animationName === 'exit') {
        winDom.classList.remove('is-out')
      }
    }
    winDom.addEventListener('animationend', animationend)

    return () => {
      isUnmounted = true
      winDom.removeEventListener('animationend', animationend)
      cancelAnimationFrame(requestID)
      textDom.textContent = `${value}`
      winDom.textContent = '0'
      winDom.classList.remove('is-in', 'is-out')
      winDom.offsetWidth // need for force layout
    }
  }, [value])

  return { totalRef: textRef, winRef }
}
