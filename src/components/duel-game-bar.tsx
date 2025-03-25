import { useEffect, useImperativeHandle, useRef } from 'react'

import { cn } from '@/lib/utils'
import { IoSkull } from 'react-icons/io5'

type ResetOptions = {
  direction?: number
  activeIndex?: number
}

export interface GameBarHandle {
  getState: () => Promise<{ value: number; isRunning: boolean }>
  highlight: () => Promise<void>
  start: (duration: number) => Promise<void>
  stop: () => Promise<void>
  reset: (options?: ResetOptions) => Promise<void>
}

const LENGTH = 23
const DEFAUTL_VALUE = 0
export const SKULL_VALUE = 50
const NUMBERS = [SKULL_VALUE, 20, 10]
const CLASS_NAMES = ['bg-red', 'bg-[#ff6c00]', 'bg-[#ff9d10]']

const getItem = (i: number) => {
  const center = LENGTH >> 1
  const index = Math.abs(center - i)
  const number = NUMBERS[index] ?? DEFAUTL_VALUE
  const className = CLASS_NAMES[index] ?? ''

  return { number, className }
}

const DuelGameBar = ({
  gameBarRef,
  onChangeDirection,
}: {
  gameBarRef: React.ForwardedRef<GameBarHandle>
  onChangeDirection: (prevDirection: number, nextDirection: number) => void
}) => {
  const wrapperRef = useRef<HTMLTableElement>(null)
  const stateRef = useRef<{
    direction: number
    activeIndex: number
    isRunning: boolean
    nextActive: HTMLTableCellElement | null
    startNumber: number
    onChangeDirection: (prevDirection: number, nextDirection: number) => void
  }>({
    direction: 1,
    activeIndex: -1,
    isRunning: false,
    nextActive: null,
    startNumber: -1,
    onChangeDirection,
  })

  useEffect(() => {
    stateRef.current.onChangeDirection = onChangeDirection
  }, [onChangeDirection])

  const getState = async () => {
    return {
      value: getItem(stateRef.current.activeIndex).number,
      isRunning: stateRef.current.isRunning,
    }
  }

  const start = async (duration: number) => {
    const barDom = wrapperRef.current

    if (barDom === null) {
      return
    }

    if (stateRef.current.isRunning) {
      return
    }

    stateRef.current.isRunning = true

    // TODO: REFACTOR
    stateRef.current.startNumber++
    const currentStartNumber = stateRef.current.startNumber

    const cells = barDom.rows[0].cells

    // TODO: USE DELAGATION
    const start = () => {
      if (!stateRef.current.isRunning) {
        return
      }

      if (currentStartNumber !== stateRef.current.startNumber) {
        return
      }

      const prevActiveIndex = stateRef.current.activeIndex
      const prevDirection = stateRef.current.direction
      let nextDirection = prevDirection
      if (prevActiveIndex === 0) nextDirection = 1
      else if (prevActiveIndex === cells.length - 1) nextDirection = -1

      if (prevDirection !== nextDirection) {
        stateRef.current.onChangeDirection(prevDirection, nextDirection)
      }

      if (!stateRef.current.isRunning) {
        return
      }

      const nextActiveIndex = prevActiveIndex + nextDirection
      stateRef.current.direction = nextDirection
      stateRef.current.activeIndex = nextActiveIndex

      const prevActive =
        stateRef.current.nextActive ?? document.createElement('td')
      const nextActive = cells[nextActiveIndex]
      stateRef.current.nextActive = nextActive

      prevActive.classList.remove('is-active')
      nextActive.classList.add('is-active')
      nextActive.style.transitionDuration = `${duration}ms`

      const transitionend = () => {
        nextActive.style.transitionDuration = ''
        start()
      }

      nextActive.addEventListener('transitionend', transitionend, {
        once: true,
      })
    }

    start()
  }

  const stop = async () => {
    stateRef.current.isRunning = false
  }

  const highlight = async () => {
    const nextActiveDom = stateRef.current.nextActive

    if (nextActiveDom === null) {
      return
    }

    const valueDom = nextActiveDom.querySelector(
      '[data-value]',
    ) as HTMLDivElement

    if (valueDom === null) {
      return
    }

    // TODO: JOIN CLASS
    valueDom.classList.add('is-selected')
    valueDom.classList.add('animate-[bar-select]')

    await new Promise((resolve) =>
      valueDom.addEventListener('animationend', resolve, { once: true }),
    )

    valueDom.classList.remove('is-selected')
    valueDom.classList.remove('animate-[bar-select]')
  }

  const reset = async (options: ResetOptions = {}) => {
    const nextActive = stateRef.current.nextActive

    if (nextActive) {
      nextActive.style.transitionDuration = ''
      nextActive.classList.remove('is-active')
    }

    stateRef.current.direction = options.direction ?? 1
    stateRef.current.activeIndex = options.activeIndex ?? -1
    stateRef.current.isRunning = false
    stateRef.current.nextActive = null
  }

  useImperativeHandle(gameBarRef, () => ({
    getState,
    start,
    stop,
    highlight,
    reset,
  }))

  return (
    <table
      ref={wrapperRef}
      className='relative h-10 w-full table-fixed border-collapse justify-center bg-[#f7f7c0]'
    >
      <thead>
        <tr>
          {Array(LENGTH)
            .fill(null)
            .map((_, i) => {
              const { number, className } = getItem(i)

              const isDefaultNumber = number === DEFAUTL_VALUE
              const isSkullNumber = number === SKULL_VALUE

              return (
                <td
                  key={i}
                  className={cn(
                    'relative border-2 border-black text-center align-middle text-[9px] text-white',
                    'transition-colors duration-20 ease-linear',
                    '[&.is-active]:text-black',
                  )}
                >
                  <div
                    className={cn(
                      'fill-mode-both absolute inset-0 z-2 flex items-center justify-center bg-[#f7f7c0] text-white select-none',
                      'repeat-1 zoom-in-200 duration-500',
                      'before:absolute before:inset-0 before:-z-1 before:bg-[#30ff00] before:opacity-0 [&.is-selected]:before:opacity-0! [.is-active_&]:before:opacity-100',
                      isDefaultNumber &&
                        'text-transparent [&.is-selected]:text-transparent',
                      isSkullNumber && '[&.is-selected]:zoom-in-400',
                      className,
                    )}
                    data-value
                  >
                    {number === 50 ? (
                      <IoSkull className='relative -top-[1px] inline-block text-base' />
                    ) : (
                      number
                    )}
                  </div>
                </td>
              )
            })}
        </tr>
      </thead>
    </table>
  )
}

export { DuelGameBar }
