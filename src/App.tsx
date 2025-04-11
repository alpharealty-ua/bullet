import { RouterProvider } from 'react-router'

import { useProfile } from '@/api/auth.api'
import { useBalance } from '@/api/wallet.api'
import { usePreloadImages } from '@/hooks/use-preload-images'
import { router } from '@/routes/router'
import { useAuthStore } from '@/store/auth.store'

const App = () => {
  const token = useAuthStore(({ accessToken }) => accessToken)
  useProfile(Boolean(token))
  useBalance(Boolean(token))

  usePreloadImages()

  return <RouterProvider router={router} />
}

export default App
