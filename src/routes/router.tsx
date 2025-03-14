import { createBrowserRouter } from 'react-router'

import { RootRouter } from '@/routes/root-router'
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/routes/routes'
import { ProtectedRoute } from '@/routes/protected-route'
import { ErrorPage } from '@/pages/error.page'

// TODO: ADD ERROR, NOT FOUND ROUTE
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRouter />,
    errorElement: <ErrorPage />,
    children: [
      ...PUBLIC_ROUTES,
      {
        path: '/',
        element: <ProtectedRoute />,
        children: PRIVATE_ROUTES,
      },
    ],
  },
])
