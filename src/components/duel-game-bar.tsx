import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

const DuelGameBar = () => {
  const ref = useRef<HTMLTableElement>(null)

  useEffect(() => {
    const barDom = ref.current

    if (barDom === null) {
      return
    }

    const cells = barDom.rows[0].cells

    let activeIndex = 0
    let active = cells[activeIndex]
    let direction = 1
    const activeClassList = ['!bg-[#30ff00]', '!text-black']
    // TODO: USE DELEGATION
    const next = () => {
      if (activeIndex === 0) direction = 1
      else if (activeIndex === cells.length - 1) direction = -1

      active.classList.remove(...activeClassList)
      active = cells[activeIndex]
      active.classList.add(...activeClassList)
      activeIndex += direction

      active.addEventListener('transitionend', next, { once: true })
    }
    next()

    return () => {
      active.classList.remove(...activeClassList)
      active.removeEventListener('transitionend', next)
    }
  }, [])

  return (
    <table
      ref={ref}
      className='relative h-10 w-full table-fixed border-collapse justify-center bg-[#f7f7c0]'
    >
      <thead>
        <tr>
          {Array(23)
            .fill(null)
            .map((_, i, arr) => {
              const center = arr.length >> 1
              const index = Math.abs(center - i)
              const range = [
                { number: 50, className: 'bg-red' },
                { number: 33, className: 'bg-[#ff6c00]' },
                { number: 20, className: 'bg-[#ff9d10]' },
                { number: 10, className: 'bg-[#ffda10]' },
              ][index] ?? { number: 0, className: '' }

              return (
                <td
                  key={i}
                  className={cn(
                    'border-2 border-black text-center align-middle text-[9px] transition-colors duration-150',
                    range.className,
                    range.number === 0 && 'text-transparent',
                  )}
                >
                  {range.number || 5}
                </td>
              )
            })}
        </tr>
      </thead>
    </table>
  )
}

export { DuelGameBar }
