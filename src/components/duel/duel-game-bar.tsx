import { useImperativeHandle, useRef } from 'react'

import { cn } from '@/lib/utils'
import { IoSkull } from 'react-icons/io5'

export interface GameBarHandle {
  highlight: (index: number) => Promise<void>
  reset: () => Promise<void>
  setActive: (index: number) => Promise<void>
}

const LENGTH = 21
const BAR_LIST = Array(LENGTH).fill(null)
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

interface DuelGameBarProps {
  gameBarRef?: React.ForwardedRef<GameBarHandle>
}

const DuelGameBar = ({ gameBarRef }: DuelGameBarProps) => {
  const wrapperRef = useRef<HTMLTableElement>(null)
  const stateRef = useRef<{
    activeEl: HTMLTableCellElement | null
  }>({
    activeEl: null,
  })

  const getCellByIndex = (index: number) => {
    if (!(index < LENGTH && index >= 0)) {
      return null
    }

    const barEl = wrapperRef.current

    if (barEl === null) {
      return null
    }

    const cellEls = barEl.rows[0].cells

    const cellEl = cellEls[index]

    if (cellEl === null) {
      return null
    }

    return cellEl
  }

  const setActive = async (index: number) => {
    const cellEl = getCellByIndex(index)

    if (cellEl === null) {
      return
    }

    const prevActiveEl =
      stateRef.current.activeEl ?? document.createElement('td')

    stateRef.current.activeEl = cellEl

    prevActiveEl.classList.remove('is-active')
    cellEl.classList.add('is-active')
  }

  const highlight = async (index: number) => {
    const cellEl = getCellByIndex(index)

    if (cellEl === null) {
      return
    }

    cellEl.classList.add('is-selected')

    await new Promise((resolve) =>
      cellEl.addEventListener('animationend', resolve, { once: true }),
    )

    cellEl.classList.remove('is-selected')
  }

  const reset = async () => {
    const activeEl = stateRef.current.activeEl

    if (activeEl) {
      activeEl.classList.remove('is-active')
    }

    stateRef.current.activeEl = null
  }

  useImperativeHandle(gameBarRef, () => ({
    highlight,
    reset,
    setActive,
  }))

  return (
    <>
      {/* table for precision border left and border right */}
      <table
        ref={wrapperRef}
        className='relative w-full table-fixed border-collapse justify-center bg-[#f7f7c0]'
      >
        <thead>
          <tr>
            {BAR_LIST.map((_, i) => {
              const { number, className } = getItem(i)

              const isDefaultNumber = number === DEFAUTL_VALUE
              const isSkullNumber = number === SKULL_VALUE

              return (
                <td
                  key={i}
                  className={cn(
                    '2xs:border-3 relative h-10 border-2 border-black bg-[#f7f7c0] text-center align-middle text-[0.5rem] text-white select-none first:border-l-0 last:border-r-0 sm:text-[0.563rem]',
                    'zoom-in-200',
                    '[&.is-selected]:fill-mode-both [&.is-selected]:repeat-[2] [&.is-selected]:direction-alternate [&.is-selected]:animate-[bar-select] [&.is-selected]:duration-250 [&.is-selected]:ease-linear',
                    isDefaultNumber && 'text-transparent',
                    isSkullNumber && 'zoom-in-400',
                    className,
                  )}
                >
                  <div className='absolute inset-0 duration-0 ease-linear [.is-active:not(.is-selected)_&]:bg-[#30ff00]'></div>
                  <div className='relative'>
                    {number === 50 ? (
                      <IoSkull className='2xs:text-base relative -top-[1px] inline-block text-sm' />
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
