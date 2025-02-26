import { BrowserRouter, Route, Routes } from 'react-router'
import NiceModal from '@ebay/nice-modal-react'

import { AppProvider } from '@/context/app-provider'
import { usePreloadImages } from '@/hooks/use-preload-images'
import { images } from '@/lib/constants'
import { Solo } from '@/components/solo'
import { Audios } from '@/components/audios'
import { Home } from '@/components/home'
import { Duel } from '@/components/duel'
import { Cover } from '@/components/cover'

const App = () => {
  usePreloadImages()

  return (
    <div
      className='relative mx-auto flex h-full min-h-[600px] max-w-[405px] translate-0 flex-col justify-between bg-cover bg-[right_center] lg:min-h-[733px]'
      style={{ backgroundImage: `url(${images.wrapper})` }}
    >
      <BrowserRouter>
        <AppProvider>
          <NiceModal.Provider>
            <Audios />
            <Routes>
              <Route index element={<Home />} />
              <Route path='/solo' element={<Cover format='solo' />} />
              <Route path='/solo/play' element={<Solo variant='play' />} />
              <Route path='/solo/watch' element={<Solo variant='watch' />} />
              <Route path='/duel' element={<Cover format='duel' />} />
              <Route path='/duel/play' element={<Duel variant='play' />} />
              <Route path='/duel/watch' element={<Duel variant='watch' />} />
            </Routes>
          </NiceModal.Provider>
        </AppProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
