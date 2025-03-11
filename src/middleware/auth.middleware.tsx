import { useEffect } from 'react'

import { useProfile } from '@/api/auth.api'
import { useBalance } from '@/api/wallet.api'
import { useAuthStore } from '@/store/auth.store'
import { useSoloStore } from '@/store/solo.store'
import { Loading } from '@/components/loading'

const AuthMiddleware = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(({ token }) => token)
  const { isLoading: profileIsLoading, data: user } = useProfile(Boolean(token))
  const { isLoading: balanceIsLoading, data: balance } = useBalance(
    Boolean(user),
  )
  const setBalance = useSoloStore(({ setBalance }) => setBalance)

  useEffect(() => {
    setBalance(balance)
  }, [setBalance, balance])

  if (profileIsLoading || balanceIsLoading) {
    return <Loading className='absolute inset-0' />
  }

  return children
}

export { AuthMiddleware }
