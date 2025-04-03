const useClick = (gunRef: React.RefObject<HTMLDivElement>) => {
  return async () => {
    const gunDom = gunRef.current

    if (gunDom === null) {
      return
    }

    const clickEls = gunDom.querySelectorAll('[data-click]')

    await Promise.all(
      Array.from(clickEls).map(async (click) => {
        click.classList.add('animate-click')
        await new Promise((resolve) =>
          click.addEventListener('animationend', resolve, { once: true }),
        )
        click.classList.remove('animate-click')
      }),
    )
  }
}

export { useClick }
