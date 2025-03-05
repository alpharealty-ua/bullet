import { useProfile } from '@/api/auth.api'
import { useBalance } from '@/api/wallet.api'
import { Loading } from '@/components/loading'

const AuthMiddleware = ({ children }: { children: React.ReactNode }) => {
  const { isLoading: profileIsLoading, data: user } = useProfile(true)
  const { isLoading: balanceIsLoading } = useBalance(Boolean(user))

  if (profileIsLoading || balanceIsLoading) {
    return <Loading className='absolute inset-0' />
  }

  return children
}

export { AuthMiddleware }
