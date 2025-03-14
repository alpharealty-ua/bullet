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
}

export type asLink = { as: 'link' } & LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>
export type asButton = {
  as: 'button'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

// TODO: ADDED CHILDREN
export type ButtonProps = {
  text?: string
} & (
  | { image: keyof typeof imagesMap; bg?: undefined }
  | {
      image?: undefined
      bg: 'green' | 'red' | 'primary' | ''
    }
) &
  (asLink | asButton)

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, image, bg, text, children, as, ...props }, ref) => {
    // eslint-disable-next-line
    const Comp: any = as === 'link' ? Link : 'button'

    return (
      <Comp
        ref={ref}
        className={cn(
          'relative inline-flex cursor-pointer items-center justify-center bg-contain bg-center bg-no-repeat text-3xl font-bold transition-transform disabled:scale-100 disabled:cursor-not-allowed',
          bg && 'rounded-md border-1 border-black px-4 py-1 text-2xl',
          bg === 'green' && 'bg-green text-white',
          bg === 'red' && 'bg-red text-white',
          bg === 'primary' && 'bg-primary',
          className,
        )}
        {...props}
      >
        {text && (
          <span
            className={cn(
              !bg && 'absolute inset-0 inline-flex items-center justify-center',
              bg && 'relative',
            )}
          >
            {text}
          </span>
        )}
        {image && <img src={imagesMap[image]} alt='' />}
      </Comp>
    )
  },
)

export { Button }
