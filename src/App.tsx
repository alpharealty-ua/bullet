import { AppProvider } from '@/context/app-provider'
import { usePreloadImages } from '@/hooks/use-preload-images'
import { Game } from '@/components/game'
import { Audios } from '@/components/audios'
import { images } from '@/lib/constants'

const App = () => {
  usePreloadImages()

  return (
    <AppProvider>
      <div
        className='relative mx-auto flex h-full min-h-[600px] max-w-[405px] flex-col justify-between bg-cover bg-[right_center] lg:min-h-[733px]'
        style={{ backgroundImage: `url(${images.wrapper})` }}
      >
        <Audios />
        <Game />
      </div>
    </AppProvider>
  )
}

export default App
