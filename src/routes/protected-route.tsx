import { useProfile } from '@/api/auth.api'
import { Navigate, Outlet } from 'react-router'
import { ROUTES } from './path'

type ProtectedRouteProps = {
  children?: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: user } = useProfile()

  if (user) {
    return children ?? <Outlet />
  }

  return <Navigate to={ROUTES.auth.login} replace />
}
