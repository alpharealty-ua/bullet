import { useCallback } from 'react'

const useClick = (ref: React.RefObject<HTMLDivElement>) => {
  return useCallback(async () => {
    const gunDom = ref.current

    if (gunDom === null) {
      return
    }

    const clickEls = gunDom.querySelectorAll('[data-click]')

    clickEls.forEach(async (click) => {
      click.classList.add('animate-click')
      await new Promise((resolve) =>
        click.addEventListener('animationend', resolve, { once: true }),
      )
      click.classList.remove('animate-click')
    })
  }, [ref])
}

export { useClick }
