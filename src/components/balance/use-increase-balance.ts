import { useRef, useEffect } from 'react'

import { wait } from '@/lib/utils'

const DOWNTIME_BETWEEN_ANIMATION = 200
const DURATION_FADE_IN_BALANCE = 500
export const TIME_BEFORE_INCREASE_BALANCE =
  DURATION_FADE_IN_BALANCE + DOWNTIME_BETWEEN_ANIMATION

export const useIncreaseBalance = ({
  value,
  increaseTime,
  decreaseTime,
  formatValue,
}: {
  value: number
  increaseTime: number
  decreaseTime: number
  formatValue: (value: number) => string
}) => {
  const totalElRef = useRef<HTMLDivElement>(null)
  const addedElRef = useRef<HTMLDivElement>(null)
  const prevValueRef = useRef(value)

  useEffect(() => {
    const totalEl = totalElRef.current
    const addedEl = addedElRef.current

    if (totalEl === null || addedEl === null) {
      return
    }

    const totalValuEl = totalEl.querySelector('[data-value]') ?? totalEl
    const addedValueEl = addedEl.querySelector('[data-value]') ?? addedEl
    const signEl = addedEl.querySelector('[data-sign]')

    const prevValue = prevValueRef.current
    prevValueRef.current = value

    const setValues = (total = value, addedValue = 0) => {
      totalValuEl.textContent = `${formatValue(Number(total.toFixed(2)))}`
      addedValueEl.textContent = `${formatValue(Number(Math.abs(addedValue).toFixed(2)))}`
    }

    if (prevValue === value) {
      setValues()
      return
    }

    let currentValue = prevValue
    const deltaValue = value - currentValue
    const isIncrease = deltaValue >= 0

    const TIME_FRAME = 16

    const TOTAL_TIME = isIncrease ? increaseTime : decreaseTime
    const COUNT = TOTAL_TIME / TIME_FRAME

    const sign = isIncrease ? 1 : -1

    signEl && (signEl.textContent = isIncrease ? '+' : '-')

    const intervalFrameValue = deltaValue / COUNT

    const addedValue = deltaValue
    setValues(prevValue, addedValue)

    const state = sign === 1 ? 'is-increase' : 'is-decrease'

    addedEl.classList.add(state, 'is-animate', 'is-in')
    addedEl.classList.remove('is-out')

    let requestID = -1
    let isUnmounted = false
    const animationend = async (event: AnimationEvent) => {
      if (isUnmounted) {
        return
      }

      if (event.animationName === 'enter') {
        await wait(DOWNTIME_BETWEEN_ANIMATION).promise
        requestID = requestAnimationFrame(function add() {
          currentValue += intervalFrameValue
          if (currentValue * sign >= value * sign) {
            setValues()
            addedEl.classList.remove('is-in')
            addedEl.classList.add('is-out')
            return
          }
          setValues(currentValue, Math.abs(value - currentValue))
          requestID = requestAnimationFrame(add)
        })
      }
      if (event.animationName === 'exit') {
        addedEl.classList.remove(state, 'is-animate', 'is-in', 'is-out')
      }
    }
    addedEl.addEventListener('animationend', animationend)

    return () => {
      isUnmounted = true
      addedEl.removeEventListener('animationend', animationend)
      cancelAnimationFrame(requestID)
      setValues()
      addedEl.classList.remove(state, 'is-animate', 'is-in', 'is-out')
      addedEl.offsetWidth // need for force layout -> for remove class
    }
  }, [value, increaseTime, decreaseTime, formatValue])

  return { totalElRef, addedElRef }
}
