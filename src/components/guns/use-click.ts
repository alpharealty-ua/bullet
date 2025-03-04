import { useCallback } from 'react'

const useClick = (ref: React.RefObject<HTMLDivElement>) => {
  return useCallback(async () => {
    const gunDom = ref.current

    if (gunDom === null) {
      return
    }

    const clicks = gunDom.querySelectorAll('[data-click]')

    clicks.forEach((click) => {
      click.classList.add('animate-click')
      click.addEventListener(
        'animationend',
        () => {
          click.classList.remove('animate-click')
        },
        { once: true },
      )
    })
  }, [ref])
}

export { useClick }
