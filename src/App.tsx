import { AppProvider } from '@/context/app-provider'
import { usePreloadImages } from '@/hooks/preload-images'
import { Debug } from '@/components/debug'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Game } from '@/components/game'
import { Audios } from '@/components/audios'

const App = () => {
  usePreloadImages()

  return (
    <AppProvider>
      <div className='relative mx-auto flex h-screen min-h-[733px] max-w-[405px] flex-col justify-between bg-[url(/assets/images/wrapper.jpg)] bg-center'>
        <Debug />
        <Audios />
        <Header />
        <Game />
        <Footer />
      </div>
    </AppProvider>
  )
}

export default App
