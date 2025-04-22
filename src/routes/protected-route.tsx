import { Navigate, Outlet, useLocation } from 'react-router'

import { useProfile } from '@/api/auth.api'
import { useBalance } from '@/api/wallet.api'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/routes/path'
import { Loading } from '@/components/ui/loading'

type ProtectedRouteProps = {
  children?: React.ReactNode
  skip?: boolean
}

const ProtectedRoute = ({ children, skip }: ProtectedRouteProps) => {
  const token = useAuthStore(({ accessToken }) => accessToken)
  const { data: user, isPending: profileIsPending } = useProfile()
  const { isPending: balanceIsPending } = useBalance()
  const { pathname } = useLocation()

  if (skip) {
    return children ?? <Outlet />
  }

  if (token && (profileIsPending || balanceIsPending)) {
    return <Loading className='absolute inset-0' />
  }

  if (user) {
    return children ?? <Outlet />
  }

  return (
    <Navigate to={ROUTES.auth.login} state={{ redirect: pathname }} replace />
  )
}

export { ProtectedRoute }
