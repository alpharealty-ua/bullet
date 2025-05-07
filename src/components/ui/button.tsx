import React from 'react'
import { Link, LinkProps } from 'react-router'

import { IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'

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

export type ButtonProps = (
  | { image: keyof typeof imagesMap; bg?: undefined }
  | {
      image?: undefined
      bg: 'green' | 'red' | 'primary' | 'white' | 'gray' | ''
    }
) &
  (asLink | asButton)

// Distributive Conditional Types.
// See more https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
export type OmitUnion<T, Keys extends keyof T> = T extends T ? Omit<T, Keys> : T

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(({ className, image, bg, children, as, ...props }, ref) => {
  // eslint-disable-next-line
  const Comp: any = as === 'link' ? Link : 'button'

  return (
    <Comp
      ref={ref}
      className={cn(
        'relative inline-flex cursor-pointer items-center justify-center bg-contain bg-center bg-no-repeat text-3xl font-bold transition-all disabled:scale-100 disabled:cursor-not-allowed data-[disabled=true]:cursor-not-allowed',
        bg && 'rounded-md border-1 border-black px-4 py-1 text-2xl',
        bg === 'green' && 'bg-green hover:bg-green/70 text-white',
        bg === 'red' && 'bg-red hover:bg-red/70 text-white',
        bg === 'primary' && 'bg-primary hover:bg-primary/90',
        bg === 'gray' && 'bg-gray-400 hover:bg-gray-100',
        bg === 'white' && 'border-gray-300 bg-white hover:bg-gray-50',
        className,
      )}
      {...props}
    >
      {children &&
        (bg === '' ? (
          children
        ) : (
          <span
            className={cn(
              bg === undefined &&
                'absolute inset-0 inline-flex items-center justify-center',
              bg && 'relative flex items-center gap-2',
            )}
          >
            {children}
          </span>
        ))}
      {image && <img src={imagesMap[image]} alt='' className='w-full' />}
    </Comp>
  )
})

export { Button }
