import { useEffect } from 'react'

import { useProfile } from '@/api/auth.api'
import { useBalance } from '@/api/wallet.api'
import { useAuthStore } from '@/store/auth.store'
import { useSoloStore } from '@/store/solo.store'

const AuthMiddleware = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(({ token }) => token)
  useProfile(Boolean(token))
  const { data: balance } = useBalance(Boolean(token))
  const setBalance = useSoloStore(({ setBalance }) => setBalance)

  useEffect(() => {
    setBalance(balance)
  }, [setBalance, balance])

  return children
}

export { AuthMiddleware }
