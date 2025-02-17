import NiceModal from '@ebay/nice-modal-react'

import { AppProvider } from '@/context/app-provider'
import { usePreloadImages } from '@/hooks/use-preload-images'
import { images } from '@/lib/constants'
import { Game } from '@/components/game'
import { Audios } from '@/components/audios'

const App = () => {
  usePreloadImages()

  return (
    <div
      className='relative mx-auto flex h-full min-h-[600px] max-w-[405px] flex-col justify-between bg-cover bg-[right_center] lg:min-h-[733px]'
      style={{ backgroundImage: `url(${images.wrapper})` }}
    >
      <AppProvider>
        <NiceModal.Provider>
          <Audios />
          <Game />
        </NiceModal.Provider>
      </AppProvider>
    </div>
  )
}

export default App
