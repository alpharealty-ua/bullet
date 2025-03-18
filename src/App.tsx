import { useEffect } from 'react'
import { RouterProvider } from 'react-router'

import { socket } from '@/socket'
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
        socket.disconnect()
      }
    }

    const onDisconnect = () => {
      console.log('disconnect')
    }

    socket.auth = { token }
    socket.connect()
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      isUnmounted = true
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      if (socket.connected) {
        socket.disconnect()
      }
    }
  }, [token])

  return <RouterProvider router={router} />
}

export default App
