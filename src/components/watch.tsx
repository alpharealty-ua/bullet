import { useAppContext } from '@/context/use-app-context'
import { CHARACTER_IMAGES, images } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Header } from './header'
import { Footer } from './footer'
import { DuelBar } from './duel-bar/duel-bar'
import { Range } from './range'

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
      {format === 'duel' && <Range />}
      <Footer format={format} />
    </>
  )
}

export { Watch }
