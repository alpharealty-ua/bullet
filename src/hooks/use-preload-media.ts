import { useEffect } from 'react'

import { SRC_AUDIOS, IMAGE_SRC_LIST } from '@/lib/constants'

export const usePreloadMedia = () => {
  useEffect(() => {
    const loadImage = (
      src: string | Record<string, string | Record<string, string>>,
    ) => {
      if (typeof src === 'object') {
        Object.values(src).forEach(loadImage)
        return
      }

      const image = new Image()
      image.src = src
    }

    IMAGE_SRC_LIST.forEach(loadImage)

    SRC_AUDIOS.forEach((value) => new Audio(value))
  }, [])
}
