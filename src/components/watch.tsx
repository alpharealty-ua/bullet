import { useAppContext } from '@/context/use-app-context'
import { CHARACTER_IMAGES, images } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Header } from './header'
import { Footer } from './footer'
import { DuelBar } from './duel-bar/duel-bar'

const Watch = ({ format }: { format: 'duel' | 'watch' }) => {
  const { characterIndex } = useAppContext()

  return (
    <>
      <Header
        logoText={format === 'duel' ? 'duel' : ''}
        hideBalance={format === 'duel'}
      />
      <DuelBar />
      {format === 'duel' && (
        <div className='mt-7 mb-8 text-center'>
          <div className='text-6xl'>Ready</div>
        </div>
      )}
      <div className='mt-auto flex flex-col gap-6'>
        <div className='relative mx-auto flex flex-col items-center justify-center gap-2'>
          {format === 'duel' && <div className='text-2xl'>BIGBALLS</div>}
          <div
            className={cn(
              'flex h-[180px] w-[180px] items-center justify-center',
              format === 'watch' && '-mb-7 h-[340px] w-[340px]',
            )}
          >
            <img
              src={CHARACTER_IMAGES[characterIndex]}
              alt=''
              className='max-h-full'
            />
          </div>
        </div>
        {format === 'duel' && (
          <div className='relative mx-auto flex h-[220px] w-[190px] items-end justify-center'>
            <img src={images.opponent} alt='' className='max-h-full' />
          </div>
        )}
      </div>
      {format === 'duel' && (
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
      )}
      <Footer format={format} />
    </>
  )
}

export { Watch }
