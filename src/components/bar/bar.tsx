import { useState } from 'react'

import { BarSide } from './bar-side'
import { SideBets } from './side-bets'
import { SideChat } from './side-chat'

const Bar = () => {
  const [openSide, setOpenSide] = useState<'left' | 'right' | null>(null)

  const handleLabelClick = (newSide: 'left' | 'right') => {
    setOpenSide(newSide === openSide ? null : newSide)
  }

  return (
    <div className='absolute top-[100px] right-0 left-0 mb-auto h-[250px] overflow-hidden'>
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

export { Bar }
