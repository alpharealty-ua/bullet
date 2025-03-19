import { useCallback, useImperativeHandle, useRef } from 'react'

import { cn } from '@/lib/utils'
import { IoSkull } from 'react-icons/io5'

export interface GameBarHandle {
  getState: () => Promise<{ value: number; isRunning: boolean }>
  highlight: () => Promise<void>
  start: (duration: number) => Promise<void>
  stop: () => Promise<void>
  reset: () => Promise<void>
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
  onChangeDirection?: (prevDirection: number, nextDirection: number) => void
}) => {
  const ref = useRef<HTMLTableElement>(null)
  const directionRef = useRef(1)
  const activeIndexRef = useRef(-1)
  const isRunningRef = useRef(false)
  const nextActiveRef = useRef<HTMLTableCellElement | null>(null)

  const start = useCallback(
    async (duration: number) => {
      const barDom = ref.current

      if (barDom === null) {
        return
      }

      if (isRunningRef.current) {
        return
      }

      isRunningRef.current = true

      const cells = barDom.rows[0].cells

      const start = () => {
        if (!isRunningRef.current) {
          return
        }

        const prevActiveIndex = activeIndexRef.current
        const prevDirection = directionRef.current
        let nextDirection = prevDirection
        if (prevActiveIndex === 0) nextDirection = 1
        else if (prevActiveIndex === cells.length - 1) nextDirection = -1

        if (prevDirection !== nextDirection) {
          onChangeDirection && onChangeDirection(prevDirection, nextDirection)
        }

        const nextActiveIndex = prevActiveIndex + nextDirection
        directionRef.current = nextDirection
        activeIndexRef.current = nextActiveIndex

        const prevActive =
          cells[prevActiveIndex] ?? document.createElement('td')
        const nextActive = cells[nextActiveIndex]
        nextActiveRef.current = nextActive

        prevActive.classList.remove('is-active')
        nextActive.classList.add('is-active')
        nextActive.style.transitionDuration = `${duration}ms`

        nextActive.addEventListener(
          'transitionend',
          () => {
            nextActive.style.transitionDuration = ''
            start()
          },
          { once: true },
        )
      }

      start()
    },
    [onChangeDirection],
  )

  useImperativeHandle(gameBarRef, () => ({
    getState: async () => {
      return {
        value: getItem(activeIndexRef.current).number,
        isRunning: isRunningRef.current,
      }
    },
    highlight: async () => {
      const nextActiveDom = nextActiveRef.current

      if (nextActiveDom === null) {
        return
      }

      const valueDom = nextActiveDom.querySelector('[data-value]')

      if (valueDom === null) {
        return
      }

      valueDom.classList.add('is-selected')

      await new Promise((resolve) =>
        valueDom.addEventListener('transitionend', resolve, { once: true }),
      )

      valueDom.classList.remove('is-selected')
    },
    start,
    stop: async () => {
      isRunningRef.current = false
    },
    reset: async () => {
      const nextActive = nextActiveRef.current

      if (nextActive) {
        nextActive.style.transitionDuration = ''
        nextActive.classList.remove('is-active')
      }

      directionRef.current = 1
      activeIndexRef.current = -1
      isRunningRef.current = false
      nextActiveRef.current = null
    },
  }))

  return (
    <div>
      <table
        ref={ref}
        className='relative h-10 w-full table-fixed border-collapse justify-center bg-[#f7f7c0]'
      >
        <thead>
          <tr>
            {Array(LENGTH)
              .fill(null)
              .map((_, i) => {
                const { number, className } = getItem(i)

                const isDefaultNumber = number === DEFAUTL_VALUE

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
                        'absolute inset-0 z-2 flex items-center justify-center text-white select-none',
                        'duration-500',
                        'bg-[#f7f7c0] [&.is-selected]:z-3 [&.is-selected]:scale-200',
                        'before:absolute before:inset-0 before:bg-[#30ff00] before:opacity-0 [.is-active_&]:before:opacity-100',
                        isDefaultNumber &&
                          'text-transparent [&.is-selected]:text-transparent',
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
    </div>
  )
}

export { DuelGameBar }
