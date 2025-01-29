import { AppProvider } from '@/context/app-provider'
import { usePreloadImages } from '@/hooks/preload-images'
import { Debug } from '@/components/debug'
import { Game } from '@/components/game'
import { Audios } from '@/components/audios'
import { images } from './lib/constants'

const App = () => {
  usePreloadImages()

  return (
    <AppProvider>
      <div
        className='relative mx-auto flex h-screen min-h-[733px] max-w-[405px] flex-col justify-between bg-center'
        style={{ backgroundImage: `url(${images.wrapper})` }}
      >
        <Debug />
        <Audios />
        <Game />
      </div>
    </AppProvider>
  )
}

export default App
