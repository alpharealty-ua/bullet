import { createBrowserRouter } from 'react-router'

import { RootRouter } from '@/routes/root-router'
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/routes/routes'
import { ProtectedRoute } from '@/routes/protected-route'
import { ErrorPage } from '@/pages/error.page'
import { NotFoundPage } from '@/pages/not-found.page'
import { PageWrapper } from '@/components/page-wrapper'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRouter />,
    errorElement: (
      <PageWrapper>
        <ErrorPage />
      </PageWrapper>
    ),
    children: [
      {
        path: '/',
        element: <ProtectedRoute skip />,
        children: PUBLIC_ROUTES,
      },
      {
        path: '/',
        element: <ProtectedRoute />,
        children: PRIVATE_ROUTES,
      },
      {
        path: '*',
        element: <ProtectedRoute skip />,
        children: [
          {
            path: '*',
            element: (
              <PageWrapper>
                <NotFoundPage />
              </PageWrapper>
            ),
          },
        ],
      },
    ],
  },
])
