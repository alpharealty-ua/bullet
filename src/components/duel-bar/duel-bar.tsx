import { useState } from 'react'

import { BarSide } from './bar-side'
import { SideBets } from './side-bets'
import { SideChat } from './side-chat'

const DuelBar = () => {
  const [openSide, setOpenSide] = useState<'left' | 'right' | null>(null)

  const handleLabelClick = (newSide: 'left' | 'right') => {
    setOpenSide(newSide === openSide ? null : newSide)
  }

  return (
    <div className='relative z-3 mb-auto h-[260px] overflow-hidden'>
      <BarSide
        side='left'
        label='Chat'
        onClickLabel={handleLabelClick}
        open={openSide === 'left'}
      >
        <SideChat />
      </BarSide>
      <BarSide
        side='right'
        label=' SIDE BETS'
        onClickLabel={handleLabelClick}
        open={openSide === 'right'}
      >
        <SideBets />
      </BarSide>
    </div>
  )
}

export { DuelBar }
