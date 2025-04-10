import React from 'react'

import { IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export interface PlayerInfoProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
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
          'absolute top-0 w-35',
          'fill-mode-both fade-out fade-in duration-500',
          side === 'left' && 'right-full translate-x-2',
          side === 'right' && 'left-full -translate-x-2',
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
          className='relative flex min-h-17.5 flex-col justify-between gap-4 rounded-md border-2 border-black bg-white bg-cover bg-center bg-no-repeat p-1 text-xs'
          style={{ backgroundImage: `url(${IMAGES.texture})` }}
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
              style={{ backgroundImage: `url(${IMAGES.flagusa})` }}
            ></div>
          </div>
        </div>
      </div>
    )
  },
)

export { PlayerInfo }
