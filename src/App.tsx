import { AppProvider } from '@/context/app-provider'
import { usePreloadImages } from '@/hooks/preload-images'
import { Debug } from '@/components/debug'
import { Game } from '@/components/game'
import { Audios } from '@/components/audios'

const App = () => {
  usePreloadImages()

  return (
    <AppProvider>
      <div className='relative mx-auto flex h-screen min-h-[733px] max-w-[405px] flex-col justify-between bg-[url(/assets/images/wrapper.jpg)] bg-center'>
        <Debug />
        <Audios />
        <Game />
      </div>
    </AppProvider>
  )
}

export default App
