import { useRef, useEffect } from 'react'

export const useIncreaseNumber = ({
  value,
  increaseTime,
  decreaseTime,
}: {
  value: number
  increaseTime: number
  decreaseTime: number
}) => {
  const totalRef = useRef<HTMLDivElement>(null)
  const winRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef(value)

  useEffect(() => {
    const totalDom = totalRef.current
    const winDom = winRef.current

    if (totalDom === null || winDom === null) {
      return
    }

    const totalValueDom = totalDom.querySelector('[data-value]') ?? totalDom
    const winValueDom = winDom.querySelector('[data-value]') ?? winDom

    const prevVal = valueRef.current
    valueRef.current = value

    if (prevVal === value) {
      totalValueDom.textContent = `${value}`
      winValueDom.textContent = '0'
      return
    }

    let currentValue = prevVal
    const deltaValue = value - currentValue
    const isIncrease = deltaValue >= 0

    const TIME_FRAME = 16

    const TOTAL_TIME = isIncrease ? increaseTime : decreaseTime
    const COUNT = TOTAL_TIME / TIME_FRAME

    const sign = isIncrease ? 1 : -1

    const intervalValue = deltaValue / COUNT

    const winValue = deltaValue
    winValueDom.textContent = `${Math.abs(winValue)}`

    const state = sign === 1 ? 'is-increase' : 'is-decrease'

    winDom.classList.add(state)
    winDom.classList.add('is-in')
    winDom.classList.remove('is-out')

    let requestID = -1
    let isUnmounted = false
    const animationend = async (event: AnimationEvent) => {
      if (isUnmounted) {
        return
      }

      if (event.animationName === 'enter') {
        requestID = requestAnimationFrame(function addNumber() {
          currentValue += intervalValue
          if (currentValue * sign >= value * sign) {
            totalValueDom.textContent = `${value}`
            winValueDom.textContent = '0'
            winDom.classList.remove('is-in')
            winDom.classList.add('is-out')
            return
          }
          const rounedValue = Math.round(currentValue)
          totalValueDom.textContent = `${rounedValue}`
          winValueDom.textContent = `${Math.abs(value - rounedValue)}`
          requestID = requestAnimationFrame(addNumber)
        })
      }
      if (event.animationName === 'exit') {
        winDom.classList.remove('is-out')
        winDom.classList.remove(state)
      }
    }
    winDom.addEventListener('animationend', animationend)

    return () => {
      isUnmounted = true
      winDom.removeEventListener('animationend', animationend)
      cancelAnimationFrame(requestID)
      totalValueDom.textContent = `${value}`
      winValueDom.textContent = '0'
      winDom.classList.remove('is-in', 'is-out', state)
      winDom.offsetWidth // need for force layout -> for rmeove class
    }
  }, [value, increaseTime, decreaseTime])

  return { totalRef, winRef }
}
