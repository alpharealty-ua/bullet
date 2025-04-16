import { RouterProvider } from 'react-router'
import { ZodError } from 'zod'

import { useProfile } from '@/api/auth.api'
import { useBalance } from '@/api/wallet.api'
import { usePreloadImages } from '@/hooks/use-preload-images'
import { router } from '@/routes/router'
import { useAuthStore } from '@/store/auth.store'
import { Notification } from '@/components/ui/notification'

const App = () => {
  const token = useAuthStore(({ accessToken }) => accessToken)
  const { error } = useProfile(Boolean(token))
  useBalance(Boolean(token))

  usePreloadImages()

  if (error && error instanceof ZodError) {
    return <Notification type='error' message={error.message} />
  }

  return <RouterProvider router={router} />
}

export default App
