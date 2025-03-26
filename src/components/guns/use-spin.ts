import React, { useCallback } from 'react'

const useSpin = (
  gunRef: React.RefObject<HTMLDivElement>,
  rotateRef: React.MutableRefObject<number>,
) => {
  return useCallback(
    async (duration = 200): Promise<void> => {
      const gunDom = gunRef.current

      if (gunDom === null) {
        return
      }

      const chamberDom = gunDom.querySelector(
        '[data-chamber-rotate]',
      ) as HTMLDivElement

      if (chamberDom === null) {
        return
      }

      return new Promise<void>((resolve) => {
        const transitionend = (event: TransitionEvent) => {
          if (event.propertyName !== 'rotate') {
            return
          }

          chamberDom.style.transitionDuration = ``
          chamberDom.removeEventListener('transitionend', transitionend)
          resolve()
        }

        chamberDom.style.rotate = (rotateRef.current += 60) + 'deg'
        chamberDom.style.transitionDuration = `${duration}ms`
        chamberDom.addEventListener('transitionend', transitionend)
      })
    },
    [gunRef, rotateRef],
  )
}

export { useSpin }
