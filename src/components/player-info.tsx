import React from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface PlayerInfoProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  side: 'left' | 'right'
  level: number
  login: string
  win: number
  visible: boolean
}

const PlayerInfo = React.forwardRef<HTMLDivElement, PlayerInfoProps>(
  ({ side, level, login, win, className, visible, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative w-[145px]',
          'fill-mode-both fade-out fade-in duration-500',
          side === 'left' && 'slide-in-from-right-20 slide-out-to-right-20',
          side === 'right' && 'slide-in-from-left-20 slide-out-to-left-20',
          visible ? 'animate-in' : 'animate-out',
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            'bg-primary absolute top-full h-4 -translate-y-3 rounded-sm',
            side === 'left' &&
              'right-1 left-0 origin-top-left skew-x-45 skew-y-2',
            side === 'right' &&
              'right-0 left-1 origin-top-right -skew-x-45 -skew-y-2',
          )}
        ></div>
        <div
          className='relative flex min-h-[70px] flex-col justify-between gap-4 rounded-md border-2 border-black bg-white bg-cover bg-center bg-no-repeat p-1 text-xs'
          style={{ backgroundImage: `url(${images.textrure})` }}
        >
          <div className='flex justify-between gap-2'>
            <div>
              <strong>{login}</strong>
            </div>
            <div>
              <strong>Lvl</strong> {level}
            </div>
          </div>
          <div className='flex justify-between gap-2'>
            <div className='self-end'>
              <strong>win:</strong>
              {win}%
            </div>
            <div
              className='h-6 w-10 bg-gray-100 bg-contain bg-center bg-no-repeat'
              style={{ backgroundImage: `url(${images.flagusa})` }}
            ></div>
          </div>
        </div>
      </div>
    )
  },
)

export { PlayerInfo }
