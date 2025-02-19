import { useAppContext } from '@/context/use-app-context'
import { CHARACTER_IMAGES } from '@/lib/constants'
import { Header } from './header'
import { Footer } from './footer'
import { DuelBar } from './duel-bar/duel-bar'

const Watch = () => {
  const { characterIndex } = useAppContext()

  return (
    <>
      <Header />
      <DuelBar />
      <div className='absolute right-0 bottom-7 left-0 mx-auto flex h-[370px] items-center justify-center'>
        <img
          src={CHARACTER_IMAGES[characterIndex]}
          alt=''
          className='max-h-full'
        />
      </div>
      <Footer format='duel' />
    </>
  )
}

export { Watch }
