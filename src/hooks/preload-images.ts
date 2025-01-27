import { useEffect } from 'react'

import { srcImages } from '@/lib/constants'

export const usePreloadImages = () => {
  useEffect(() => {
    srcImages.forEach((src) => {
      const image = new Image()
      image.src = src

      image.addEventListener('load', () => {
        console.log(image)
      })
    })
  }, [])
}
