import { useAppContext } from '@/context/use-app-context'
import { CHARACTER_IMAGES, images } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Header } from './header'
import { Footer } from './footer'
import { DuelBar } from './duel-bar/duel-bar'
import { Logo } from './logo'

const Watch = ({ format }: { format: 'duel' | 'watch' }) => {
  const { characterIndex } = useAppContext()

  return (
    <>
      {/* TODO: REFACTOR  */}
      {format === 'watch' && <Header />}
      {format === 'duel' && (
        <header className='flex items-center justify-between px-3 py-2'>
          <Logo to='/' text='duel' />
        </header>
      )}
      <DuelBar />
      {format === 'duel' && (
        <div className='mt-7 mb-8 text-center'>
          <div className='text-6xl'>Ready</div>
        </div>
      )}
      <div className='mt-auto flex flex-col gap-6'>
        <div className='relative mx-auto flex flex-col items-center justify-center gap-2'>
          {format === 'duel' && <div className='text-2xl'>BIGBALLS</div>}
          <div className='flex h-[180px] w-[180px] items-center justify-center'>
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
        <div className='relative flex h-10 justify-center border-t-3 border-b-3 border-black bg-[#f7f7c0]'>
          <div className='gradient pointer-events-none absolute inset-0'></div>
          {[5, 10, 20, 33, 50, 33, 20, 10, 5].map((num, i) => (
            <div
              key={i}
              className={cn(
                'flex h-full w-[15px] justify-center pt-4.5 text-[10px]',
                num === 50 && 'bg-red pt-2',
                num === 33 && 'bg-[#ff6c00] pt-2.5',
                num === 20 && 'bg-[#ff9d10] pt-3',
                num === 10 && 'bg-[#ffda10] pt-3.5',
              )}
            >
              {num}
            </div>
          ))}
        </div>
      )}

      <Footer format={format} />
    </>
  )
}

export { Watch }
