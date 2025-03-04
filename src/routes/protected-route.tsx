import { Navigate, Outlet, useLocation } from 'react-router'

import { useProfile } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'

type ProtectedRouteProps = {
  children?: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: user } = useProfile()
  const { pathname } = useLocation()

  if (user) {
    return children ?? <Outlet />
  }

  return (
    <Navigate to={ROUTES.auth.login} state={{ redirect: pathname }} replace />
  )
}
