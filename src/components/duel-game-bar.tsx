import { useCallback, useImperativeHandle, useRef } from 'react'

import { cn } from '@/lib/utils'

export type GameBarHandle = {
  start: (duration: number) => Promise<void>
  stop: () => Promise<number>
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
}: {
  gameBarRef: React.ForwardedRef<GameBarHandle>
}) => {
  const ref = useRef<HTMLTableElement>(null)
  const directionRef = useRef(1)
  const activeIndexRef = useRef(-1)
  const isRunningRef = useRef(false)

  const start = useCallback(async (duration: number) => {
    const barDom = ref.current

    if (barDom === null) {
      return
    }

    const cells = barDom.rows[0].cells

    isRunningRef.current = true

    const start = () => {
      if (!isRunningRef.current) {
        return
      }

      const prevActiveIndex = activeIndexRef.current
      let direction = directionRef.current
      if (prevActiveIndex === 0) direction = 1
      else if (prevActiveIndex === cells.length - 1) direction = -1

      const nextActiveIndex = prevActiveIndex + direction
      directionRef.current = direction
      activeIndexRef.current = nextActiveIndex

      const prevActive = cells[prevActiveIndex] ?? document.createElement('td')
      const nextActive = cells[nextActiveIndex]

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
  }, [])

  useImperativeHandle(gameBarRef, () => ({
    start,
    stop: async () => {
      isRunningRef.current = false
      return getItem(activeIndexRef.current).number
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
                      'border-2 border-black text-center align-middle text-[9px] transition-colors duration-10',
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
