import { Outlet, ScrollRestoration } from 'react-router'
import { ZodError } from 'zod'

import { useProfile } from '@/api/auth.api'
import { useBalance } from '@/api/wallet.api'
import { usePreloadMedia } from '@/hooks/use-preload-media'
import { useAuthStore } from '@/store/auth.store'
import { useBulletSound } from '@/hooks/use-bullet-sound'
import { Notification } from '@/components/ui/notification'
import { Debug } from '@/components/debug'
import { Providers } from '@/providers'

const RootRouter = () => (
  <Providers>
    <Debug />
    <App />
  </Providers>
)

const App = () => {
  const token = useAuthStore(({ accessToken }) => accessToken)
  const { error } = useProfile(Boolean(token))
  useBalance(Boolean(token))

  usePreloadMedia()
  useBulletSound()

  if (error && error instanceof ZodError) {
    return <Notification type='error' message={error.message} />
  }

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}

export { RootRouter }
