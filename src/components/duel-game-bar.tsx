import { useCallback, useImperativeHandle, useRef } from 'react'

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
  onChangeDirection?: (prevDirection: number, nextDirection: number) => void
}) => {
  const ref = useRef<HTMLTableElement>(null)
  const directionRef = useRef(1)
  const activeIndexRef = useRef(-1)
  const isRunningRef = useRef(false)
  const nextActiveRef = useRef<HTMLTableCellElement | null>(null)

  const getState = async () => {
    return {
      value: getItem(activeIndexRef.current).number,
      isRunning: isRunningRef.current,
    }
  }

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

  const stop = async () => {
    isRunningRef.current = false
  }

  const highlight = async () => {
    const nextActiveDom = nextActiveRef.current

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
    const nextActive = nextActiveRef.current

    if (nextActive) {
      nextActive.style.transitionDuration = ''
      nextActive.classList.remove('is-active')
    }

    directionRef.current = options.direction ?? 1
    activeIndexRef.current = options.activeIndex ?? -1
    isRunningRef.current = false
    nextActiveRef.current = null
  }

  useImperativeHandle(gameBarRef, () => ({
    getState,
    start,
    stop,
    highlight,
    reset,
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
    </div>
  )
}

export { DuelGameBar }
