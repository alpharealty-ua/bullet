import { Route, Routes } from 'react-router'

import { usePreloadImages } from '@/hooks/use-preload-images'
import { Audios } from '@/components/audios'
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/routes/routes'
import { ProtectedRoute } from '@/routes/protected-route'
import { useProfile } from '@/api/auth.api'
import { Loading } from '@/components/loading'

const App = () => {
  const { data: user, isLoading } = useProfile()
  usePreloadImages()

  return (
    <>
      <Audios />
      {isLoading ? (
        <Loading className='absolute inset-0' />
      ) : (
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
      )}
    </>
  )
}

export default App
