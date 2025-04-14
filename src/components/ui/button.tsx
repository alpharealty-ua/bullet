import React from 'react'

import { IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Link, LinkProps } from 'react-router'

const imagesMap = {
  button: IMAGES.button,
  solo: IMAGES.solo,
  play: IMAGES.play,
  pull: IMAGES.pull,
  deal: IMAGES.deal,
  duel: IMAGES.duel,
  watch: IMAGES.watch,
  gamerules: IMAGES.gamerules,
  close: IMAGES.close,
  moneybag: IMAGES.moneybag,
  leaderboardstar: IMAGES.leaderboardstar,
  settings: IMAGES.settings,
}

export type asLink = { as: 'link' } & LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>
export type asButton = {
  as: 'button'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

// TODO: REMOVE TEXT
export type ButtonProps = {
  text?: string
} & (
  | { image: keyof typeof imagesMap; bg?: undefined }
  | {
      image?: undefined
      bg: 'green' | 'red' | 'primary' | 'white' | ''
    }
) &
  (asLink | asButton)

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(({ className, image, bg, text, children, as, ...props }, ref) => {
  // eslint-disable-next-line
  const Comp: any = as === 'link' ? Link : 'button'

  return (
    <Comp
      ref={ref}
      className={cn(
        'relative inline-flex cursor-pointer items-center justify-center bg-contain bg-center bg-no-repeat text-3xl font-bold transition-all disabled:scale-100 disabled:cursor-not-allowed data-[disabled=true]:cursor-not-allowed',
        // TODO: ADD HOVERS
        bg && 'rounded-md border-1 border-black px-4 py-1 text-2xl',
        bg === 'green' && 'bg-green text-white',
        bg === 'red' && 'bg-red text-white',
        bg === 'primary' && 'bg-primary',
        bg === 'white' && 'border-gray-300 bg-white hover:bg-gray-50',
        className,
      )}
      {...props}
    >
      {(text || children) && (
        <span
          className={cn(
            !bg && 'absolute inset-0 inline-flex items-center justify-center',
            bg && 'relative flex items-center gap-2',
          )}
        >
          {text || children}
        </span>
      )}
      {image && <img src={imagesMap[image]} alt='' className='w-full' />}
    </Comp>
  )
})

export { Button }
