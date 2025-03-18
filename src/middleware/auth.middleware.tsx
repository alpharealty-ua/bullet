import { useEffect } from 'react'

import { useProfile } from '@/api/auth.api'
import { useBalance } from '@/api/wallet.api'
import { useAuthStore } from '@/store/auth.store'
import { useGameStore } from '@/store/game.store'

// TODO: MOVE TO APP
const AuthMiddleware = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(({ token }) => token)
  useProfile(Boolean(token))
  const { data: balance } = useBalance(Boolean(token))
  const setBalance = useGameStore(({ setBalance }) => setBalance)

  // TODO: REMOVE
  useEffect(() => {
    setBalance(balance)
  }, [setBalance, balance])

  return children
}

export { AuthMiddleware }
