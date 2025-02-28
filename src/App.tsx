import { Route, Routes } from 'react-router'

import { usePreloadImages } from '@/hooks/use-preload-images'
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/routes/routes'
import { ProtectedRoute } from '@/routes/protected-route'

const App = () => {
  usePreloadImages()

  return (
    <Routes>
      {PUBLIC_ROUTES.map(({ path, element }, i) => (
        <Route key={i} path={path} element={element} />
      ))}
      <Route element={<ProtectedRoute />}>
        {PRIVATE_ROUTES.map(({ path, element }, i) => (
          <Route key={i} path={path} element={element} />
        ))}
      </Route>
    </Routes>
  )
}

export default App
