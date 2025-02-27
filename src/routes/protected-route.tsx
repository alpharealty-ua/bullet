import { Navigate, Outlet } from 'react-router'

type ProtectedRouteProps = {
  isAuth: boolean
  children?: React.ReactNode
}

export const ProtectedRoute = ({ isAuth, children }: ProtectedRouteProps) => {
  if (isAuth) {
    return children ?? <Outlet />
  }

  return <Navigate to='/' replace />
}
