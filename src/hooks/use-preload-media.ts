import { useEffect } from 'react'

import { SRC_AUDIOS, SRC_IMAGES } from '@/lib/constants'

export const usePreloadMedia = () => {
  useEffect(() => {
    SRC_IMAGES.forEach((src) => {
      const image = new Image()
      image.src = src
    })
    SRC_AUDIOS.forEach((value) => new Audio(value))
  }, [])
}
