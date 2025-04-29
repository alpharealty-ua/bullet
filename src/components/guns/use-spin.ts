import React from 'react'

const useSpin = (
  gunRef: React.RefObject<HTMLDivElement>,
  rotateRef: React.MutableRefObject<number>,
) => {
  return async (duration = 200): Promise<void> => {
    const chamberEl = gunRef.current?.querySelector(
      '[data-chamber-rotate]',
    ) as HTMLDivElement

    if (chamberEl == null) {
      return
    }

    return new Promise<void>((resolve) => {
      const transitionend = (event: TransitionEvent) => {
        if (event.propertyName !== 'rotate') {
          return
        }

        chamberEl.style.transitionDuration = ``
        chamberEl.removeEventListener('transitionend', transitionend)
        resolve()
      }

      chamberEl.style.rotate = (rotateRef.current += 60) + 'deg'
      chamberEl.style.transitionDuration = `${duration}ms`
      chamberEl.addEventListener('transitionend', transitionend)
    })
  }
}

export { useSpin }
