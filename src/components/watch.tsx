import { useAppContext } from '@/context/use-app-context'
import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Header } from './header'
import { Footer } from './footer'
import { Bar } from '@/components/bar/bar'
import { DuelGameBar } from './duel-game-bar'
import { Character } from './character'

const Watch = ({ format }: { format: 'duel' | 'watch' }) => {
  const { characterIndex } = useAppContext()

  return (
    <>
      <Header
        logoText={format === 'duel' ? 'duel' : ''}
        hideBalance={format === 'duel'}
      />
      <Bar />
      <div className='mt-auto flex flex-col gap-6'>
        <div className='relative mx-12 flex grow-1 flex-col items-center justify-center gap-2'>
          <Character
            className={cn(
              'ml-auto h-[250px]',
              format === 'watch' && 'mx-auto -mb-7 h-[300px]',
            )}
            characterIndex={characterIndex}
          />
          <div className='absolute bottom-0 left-0 text-center'>
            <div className='text-4xl'>Ready</div>
            <div className='text-4xl'>Set</div>
            <div className='text-4xl'>Pull</div>
          </div>
        </div>
        {format === 'duel' && (
          <div className='relative'>
            <div
              className='relative mx-auto aspect-[190/220] w-[170px] items-end justify-center bg-contain bg-center bg-no-repeat'
              style={{ backgroundImage: `url(${images.opponent})` }}
            ></div>
            <div className='absolute right-0 bottom-0 flex items-center justify-between px-4'>
              <div className='relative'>
                <Button className='w-24' image='pull' />
              </div>
            </div>
          </div>
        )}
      </div>
      {format === 'duel' && <DuelGameBar />}
      <Footer format={format} />
    </>
  )
}

export { Watch }
