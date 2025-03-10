import { useEffect } from 'react'

import { SRC_IMAGES } from '@/lib/constants'

export const usePreloadImages = () => {
  useEffect(() => {
    SRC_IMAGES.forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [])
}
