import { cn } from '@/lib/utils'
import { useImperativeHandle, useRef } from 'react'

export type GameBarHandle = {
  next: (duration: number) => Promise<void>
}

const DuelGameBar = ({
  gameBarRef,
}: {
  gameBarRef: React.ForwardedRef<GameBarHandle>
}) => {
  const ref = useRef<HTMLTableElement>(null)
  const directionRef = useRef(1)
  const activeIndexRef = useRef(-1)

  const next = async (duration: number) => {
    const barDom = ref.current

    if (barDom === null) {
      return
    }

    const cells = barDom.rows[0].cells

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

    return new Promise<void>((resolve) => {
      nextActive.addEventListener(
        'transitionend',
        () => {
          nextActive.style.transitionDuration = ''
          resolve()
        },
        { once: true },
      )
    })
  }

  useImperativeHandle(gameBarRef, () => ({
    next,
  }))

  return (
    <div className='overflow-hidden'>
      <table
        ref={ref}
        className='relative -mx-0.5 h-10 w-[calc(100%+4px)] table-fixed border-collapse justify-center bg-[#f7f7c0]'
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
                      'border-2 border-black text-center align-middle text-[9px] transition-colors duration-10',
                      '[&.is-active]:bg-[#30ff00] [&.is-active]:text-black',
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
    </div>
  )
}

export { DuelGameBar }
