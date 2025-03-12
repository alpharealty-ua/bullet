import { RouterProvider } from 'react-router'

import { usePreloadImages } from '@/hooks/use-preload-images'
import { router } from '@/routes/router'

const App = () => {
  usePreloadImages()

  return <RouterProvider router={router} />
}

export default App
