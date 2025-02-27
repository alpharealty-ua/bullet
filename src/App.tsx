import { Route, Routes } from 'react-router'
import NiceModal from '@ebay/nice-modal-react'

import { usePreloadImages } from '@/hooks/use-preload-images'
import { images } from '@/lib/constants'
import { Audios } from '@/components/audios'
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/routes/routes'
import { ProtectedRoute } from '@/routes/protected-route'
import { useUser } from '@/api/auth.api'
import { AppProvider } from '@/context/app-provider'

const App = () => {
  const user = useUser()
  usePreloadImages()

  return (
    <div
      className='relative mx-auto flex h-full min-h-[600px] max-w-[405px] translate-0 flex-col justify-between bg-cover bg-[right_center] lg:min-h-[733px]'
      style={{ backgroundImage: `url(${images.wrapper})` }}
    >
      <AppProvider>
        <NiceModal.Provider>
          <Audios />
          <Routes>
            {PUBLIC_ROUTES.map(({ path, element }, i) => (
              <Route key={i} path={path} element={element} />
            ))}
            <Route element={<ProtectedRoute isAuth={Boolean(user)} />}>
              {PRIVATE_ROUTES.map(({ path, element }, i) => (
                <Route key={i} path={path} element={element} />
              ))}
            </Route>
          </Routes>
        </NiceModal.Provider>
      </AppProvider>
    </div>
  )
}

export default App
