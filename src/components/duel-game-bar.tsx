import { useCallback, useImperativeHandle, useRef } from 'react'

import { cn } from '@/lib/utils'

export type GameBarHandle = {
  start: (duration: number) => Promise<void>
  stop: () => Promise<number>
  reset: () => Promise<void>
}

const LENGTH = 23
const DEFAUTL_NUMBER = 5
const NUMBERS = [50, 33, 20, 10]
const CLASS_NAMES = ['bg-red', 'bg-[#ff6c00]', 'bg-[#ff9d10]', 'bg-[#ffda10]']

const getItem = (i: number) => {
  const center = LENGTH >> 1
  const index = Math.abs(center - i)
  const number = NUMBERS[index] ?? DEFAUTL_NUMBER
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
    start,
    stop: async () => {
      isRunningRef.current = false
      return getItem(activeIndexRef.current).number
    },
    reset: async () => {
      directionRef.current = 1
      activeIndexRef.current = -1
      isRunningRef.current = false
      const nextActive = nextActiveRef.current
      if (nextActive) {
        nextActive.style.transitionDuration = ''
        nextActive.classList.remove('is-active')
      }
    },
  }))

  return (
    <div className='overflow-hidden'>
      <table
        ref={ref}
        className='relative -mx-0.5 h-10 w-[calc(100%+4px)] table-fixed border-collapse justify-center bg-[#f7f7c0]'
      >
        <thead>
          <tr>
            {Array(LENGTH)
              .fill(null)
              .map((_, i) => {
                const { number, className } = getItem(i)

                return (
                  <td
                    key={i}
                    className={cn(
                      'border-2 border-black text-center align-middle text-[9px] transition-colors duration-20 ease-linear',
                      '[&.is-active]:bg-[#30ff00] [&.is-active]:text-black',
                      className,
                      number === DEFAUTL_NUMBER && 'text-transparent',
                    )}
                  >
                    {number}
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
