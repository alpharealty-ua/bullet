import { Navigate, Outlet, Route, Routes } from 'react-router'

import { Providers } from '@/providers'
import { usePreloadImages } from '@/hooks/use-preload-images'
import { images } from '@/lib/constants'
import { Audios } from '@/components/audios'
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/routes/routes'

type ProtectedRouteProps = {
  isLogin: boolean
  children?: React.ReactNode
}

const ProtectedRoute = ({ isLogin, children }: ProtectedRouteProps) => {
  if (isLogin) {
    return children ?? <Outlet />
  }

  return <Navigate to='/' replace />
}

const App = () => {
  usePreloadImages()

  return (
    <div
      className='relative mx-auto flex h-full min-h-[600px] max-w-[405px] translate-0 flex-col justify-between bg-cover bg-[right_center] lg:min-h-[733px]'
      style={{ backgroundImage: `url(${images.wrapper})` }}
    >
      <Audios />
      <Routes>
        {PUBLIC_ROUTES.map(({ path, element }, i) => (
          <Route key={i} path={path} element={element} />
        ))}
        <Route element={<ProtectedRoute isLogin={false} />}>
          {PRIVATE_ROUTES.map(({ path, element }, i) => (
            <Route key={i} path={path} element={element} />
          ))}
        </Route>
      </Routes>
    </div>
  )
}

export default App
