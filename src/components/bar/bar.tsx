import { useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { BarSide } from '@/components/bar/bar-side'
import { SideBets } from '@/components/bar/side-bets'
import { SideChat } from '@/components/bar/side-chat'

const Bar = () => {
  const [openSide, setOpenSide] = useState<'left' | 'right' | null>(null)

  const toggle = useCallback(
    (newSide: 'left' | 'right') => {
      setOpenSide((openSide) => (newSide === openSide ? null : newSide))
    },
    [setOpenSide],
  )

  const handleLabelClick = useCallback(
    (newSide: 'left' | 'right') => {
      toggle(newSide)
    },
    [toggle],
  )

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenSide(null)
      }
    }

    document.addEventListener('keydown', close)

    return () => {
      document.removeEventListener('keydown', close)
    }
  }, [setOpenSide, toggle])

  return (
    <div className='absolute top-25 right-0 left-0 mb-auto h-62.5 overflow-hidden'>
      <BarSide
        side='left'
        label='Chat'
        onClickLabel={handleLabelClick}
        open={openSide === 'left'}
      >
        <SideChat
          languageProps={{
            className: cn(
              'top-auto bottom-2 opacity-0 transition-all duration-1000',
              openSide === 'left' && 'translate-x-full pl-1.5 opacity-100',
            ),
          }}
        />
      </BarSide>
      <BarSide
        side='right'
        label='Live bet'
        onClickLabel={handleLabelClick}
        open={openSide === 'right'}
      >
        <SideBets />
      </BarSide>
    </div>
  )
}

export { Bar }
