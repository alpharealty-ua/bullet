import { Navigate, Outlet } from 'react-router'

type ProtectedRouteProps = {
  isLogin: boolean
  children?: React.ReactNode
}

export const ProtectedRoute = ({ isLogin, children }: ProtectedRouteProps) => {
  if (isLogin) {
    return children ?? <Outlet />
  }

  return <Navigate to='/' replace />
}
