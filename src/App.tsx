import { useEffect } from 'react'
import { RouterProvider } from 'react-router'

import { socketGame } from '@/socket/socket'
import { usePreloadImages } from '@/hooks/use-preload-images'
import { router } from '@/routes/router'
import { useAuthStore } from '@/store/auth.store'

const App = () => {
  usePreloadImages()
  const token = useAuthStore(({ token }) => token)

  useEffect(() => {
    if (token === null) {
      return
    }

    let isUnmounted = false

    const onConnect = () => {
      console.log('connect')

      if (isUnmounted) {
        socketGame.disconnect()
      }
    }

    const onDisconnect = () => {
      console.log('disconnect')
    }

    socketGame.auth = { token }
    // socketGame.connect()
    socketGame.on('connect', onConnect)
    socketGame.on('disconnect', onDisconnect)

    return () => {
      isUnmounted = true
      socketGame.off('connect', onConnect)
      socketGame.off('disconnect', onDisconnect)
      if (socketGame.connected) {
        socketGame.disconnect()
      }
    }
  }, [token])

  return <RouterProvider router={router} />
}

export default App
