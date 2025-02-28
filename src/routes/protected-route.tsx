import { useProfile } from '@/api/auth.api'
import { Navigate, Outlet } from 'react-router'

type ProtectedRouteProps = {
  children?: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: user } = useProfile()

  if (user) {
    return children ?? <Outlet />
  }

  return <Navigate to='/' replace />
}
