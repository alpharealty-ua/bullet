import { useImperativeHandle, useRef } from 'react'

import { IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Bet } from '@/components/bet'
import { Bullets } from '@/components/bullets'
import { SettingsButton } from '@/components/ui/settings-button'
import { LeaderboardButton } from '@/components/ui/leaderboard-button'

export interface FooterHandle {
  wiggleWager: () => Promise<void>
}

const Footer = ({
  disabledBet,
  maxBet,
  bet,
  countBullet,
  setBet,
  footerHandleRef,
}: {
  disabledBet: boolean
  maxBet: number
  bet: number
  countBullet: number
  setBet: (bet: number) => void
  footerHandleRef?: React.ForwardedRef<FooterHandle>
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(footerHandleRef, () => ({
    wiggleWager: async () => {
      const waggerEl = wrapperRef.current?.querySelector(
        '[data-wager]',
      ) as HTMLDivElement

      if (waggerEl == null) {
        return
      }

      waggerEl.classList.add('animate-wiggle')

      waggerEl.addEventListener(
        'animationend',
        () => {
          waggerEl.classList.remove('animate-wiggle')
        },
        { once: true },
      )
    },
  }))

  return (
    <footer
      className='relative flex h-25 justify-between border-t-2 border-black bg-[#f2f2f2] px-2 py-1'
      style={{ backgroundImage: `url(${IMAGES.texture})` }}
      ref={wrapperRef}
    >
      <div className='relative flex w-full max-w-1/2 flex-col items-center'>
        <div className='relative flex w-full flex-col gap-2.5 text-center'>
          <div
            className={cn(
              'text-green self-start pl-7 text-left text-2xl leading-[1] tracking-tight uppercase',
              'repeat-1 duration-500',
            )}
            data-wager
          >
            Wager
          </div>
          <Bet
            disabled={disabledBet}
            maxBet={maxBet}
            bet={bet}
            onBet={setBet}
            size='sm'
          />
        </div>
      </div>
      <div className='relative flex flex-col items-end justify-between'>
        <div className='flex flex-col items-center'>
          <Bullets countBullet={countBullet} />
          <div>Pulls remaining</div>
        </div>
        <div className='flex items-center gap-1'>
          <LeaderboardButton as='button' />
          <SettingsButton />
        </div>
      </div>
    </footer>
  )
}

export { Footer }
