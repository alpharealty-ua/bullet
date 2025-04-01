import { useEffect, useImperativeHandle, useRef } from 'react'

import { cn } from '@/lib/utils'
import { IoSkull } from 'react-icons/io5'

type ResetOptions = {
  direction?: number
  activeIndex?: number
}

export interface GameBarHandle {
  getState: () => Promise<{ value: number; isRunning: boolean }>
  highlight: (index: number) => Promise<void>
  start: (duration: number) => Promise<void>
  stop: () => Promise<void>
  reset: (options?: ResetOptions) => Promise<void>
  setActive: (index: number) => Promise<void>
}

const LENGTH = 21
const DEFAUTL_VALUE = 0
const SKULL_VALUE = 50
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

  // TODO: REMOVE. NOT USE
  const getState = async () => {
    return {
      value: getItem(stateRef.current.activeIndex).number,
      isRunning: stateRef.current.isRunning,
    }
  }

  // TODO: REMOVE. NOT USE
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
    const start = async () => {
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

      await new Promise((resolve) =>
        nextActive.addEventListener('transitionend', resolve, {
          once: true,
        }),
      )

      nextActive.style.transitionDuration = ''

      if (currentStartNumber !== stateRef.current.startNumber) {
        return
      }

      if (!stateRef.current.isRunning) {
        return
      }

      start()
    }

    start()
  }

  // TODO: REMOVE. NOT USE
  const stop = async () => {
    stateRef.current.isRunning = false
  }

  const setActive = async (index: number) => {
    if (!(index < LENGTH && index >= 0)) {
      return
    }

    const barDom = wrapperRef.current

    if (barDom === null) {
      return
    }

    const cells = barDom.rows[0].cells

    const prevActive =
      stateRef.current.nextActive ?? document.createElement('td')

    const nextActive = cells[index]
    stateRef.current.nextActive = nextActive

    prevActive.classList.remove('is-active')
    nextActive.classList.add('is-active')
  }

  const highlight = async (index: number) => {
    const barDom = wrapperRef.current

    if (barDom === null) {
      return
    }

    const cellEls = barDom.rows[0].cells

    const cellEl = cellEls[index]

    if (cellEl === null) {
      return
    }

    // TODO: JOIN CLASS
    cellEl.classList.add('is-selected')
    cellEl.classList.add('animate-[bar-select]')

    await new Promise((resolve) =>
      cellEl.addEventListener('animationend', resolve, { once: true }),
    )

    cellEl.classList.remove('is-selected')
    cellEl.classList.remove('animate-[bar-select]')
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
    setActive,
  }))

  return (
    <>
      {/* table for precision border left and border right */}
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
                      'relative border-2 border-black bg-[#f7f7c0] text-center align-middle text-[9px] text-white select-none first:border-l-0 last:border-r-0',
                      'transition-colors duration-20 ease-linear',
                      'zoom-in-200 fill-mode-both repeat-1 duration-500',
                      isDefaultNumber && 'text-transparent',
                      isSkullNumber && 'zoom-in-400',
                      className,
                    )}
                  >
                    <div className='absolute inset-0 bg-[#30ff00] opacity-0 [.is-active_&]:opacity-100 [.is-selected_&]:opacity-0'></div>
                    <div className='relative'>
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
    </>
  )
}

export { DuelGameBar }
