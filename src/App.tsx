import { useEffect } from 'react'
import { RouterProvider } from 'react-router'

import { useProfile } from '@/api/auth.api'
import { useBalance } from '@/api/wallet.api'
import { usePreloadImages } from '@/hooks/use-preload-images'
import { router } from '@/routes/router'
import { useAuthStore } from '@/store/auth.store'
import { useGameStore } from '@/store/game.store'

const App = () => {
  const token = useAuthStore(({ accessToken: token }) => token)
  useProfile(Boolean(token))
  const { data: balance } = useBalance(Boolean(token))
  const setBalance = useGameStore(({ setBalance }) => setBalance)

  // TODO: REMOVE
  useEffect(() => {
    setBalance(balance)
  }, [setBalance, balance])

  usePreloadImages()

  return <RouterProvider router={router} />
}

export default App
