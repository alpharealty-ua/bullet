import { Navigate, Outlet, useLocation } from 'react-router'

import { useProfile } from '@/api/auth.api'
import { useBalance } from '@/api/wallet.api'
import { ROUTES } from '@/routes/path'
import { Loading } from '@/components/loading'

type ProtectedRouteProps = {
  children?: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isPending: profileIsPending, data: user } = useProfile()
  const { isPending: balanceIsPending } = useBalance()
  const { pathname } = useLocation()

  if (profileIsPending || balanceIsPending) {
    return <Loading className='absolute inset-0' />
  }

  if (user) {
    return children ?? <Outlet />
  }

  return (
    <Navigate to={ROUTES.auth.login} state={{ redirect: pathname }} replace />
  )
}
