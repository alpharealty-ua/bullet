import { cn } from '@/lib/utils'

const Range = () => {
  return (
    <div className='relative table h-10 w-full table-fixed border-collapse justify-center bg-[#f7f7c0] [&_.table-cell]:border-2 [&_.table-cell]:border-black'>
      <div className='table-row'>
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
              { number: 5, className: '' },
            ][index] ?? { number: 0, className: '' }

            return (
              <div
                key={i}
                className={cn(
                  'table-cell cursor-pointer text-center align-middle text-[9px] transition-colors hover:bg-[#30ff00]',
                  range.className,
                )}
              >
                {range.number > 0 && range.number}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export { Range }
