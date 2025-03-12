import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router'

import { RootRouter } from '@/routes/root-router'
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/routes/routes'
import { ProtectedRoute } from '@/routes/protected-route'

// TODO: ADD ERROR, NOT FOUND ROUTE
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootRouter />}>
      {PUBLIC_ROUTES.map(({ path, element }, i) => (
        <Route key={i} path={path} element={element} />
      ))}
      <Route element={<ProtectedRoute />}>
        {PRIVATE_ROUTES.map(({ path, element }, i) => (
          <Route key={i} path={path} element={element} />
        ))}
      </Route>
    </Route>,
  ),
)
