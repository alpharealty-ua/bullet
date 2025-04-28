const useClick = (gunRef: React.RefObject<HTMLDivElement>) => {
  return async () => {
    const gunDom = gunRef.current

    if (gunDom === null) {
      return
    }

    const ANIMATION_NAME = 'animate-click'
    const clickEls = gunDom.querySelectorAll('[data-click]')

    await Promise.all(
      Array.from(clickEls).map(async (clickEl) => {
        clickEl.classList.add(ANIMATION_NAME)
        await new Promise((resolve) =>
          clickEl.addEventListener('animationend', resolve, { once: true }),
        )
        clickEl.classList.remove(ANIMATION_NAME)
      }),
    )
  }
}

export { useClick }
