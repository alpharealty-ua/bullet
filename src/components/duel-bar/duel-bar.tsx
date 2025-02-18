import { useEffect, useRef } from 'react'

import { BarSide } from './bar-side'
import { SideBets } from './side-bets'
import { SideChat } from './side-chat'

const DuelBar = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapperDom = ref.current

    if (wrapperDom === null) {
      return
    }

    wrapperDom.style.scrollBehavior = 'auto'
    wrapperDom.scrollLeft = wrapperDom.scrollWidth
    wrapperDom.style.scrollBehavior = ''
  }, [])

  const handleLabelClick = (direction: 'start' | 'end') => {
    const wrapperDom = ref.current

    if (wrapperDom === null) {
      return
    }

    wrapperDom.scrollLeft = direction === 'start' ? 0 : wrapperDom.scrollWidth
  }

  return (
    <div
      ref={ref}
      className='relative z-3 flex min-h-[200px] overflow-hidden scroll-smooth'
    >
      <BarSide
        side='left'
        label='Chat'
        onClickButton={() => handleLabelClick('start')}
      >
        <SideChat />
      </BarSide>
      <BarSide
        side='right'
        label=' SIDE BETS'
        onClickButton={() => handleLabelClick('end')}
      >
        <SideBets />
      </BarSide>
    </div>
  )
}

export { DuelBar }
