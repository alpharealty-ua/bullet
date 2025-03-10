import React from 'react'

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
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  image?: keyof typeof imagesMap | ''
  bg?: 'green' | 'red' | 'primary'
  text?: string
}

// ADD ON CLICK WRAPPER FOR AUDIO
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, image = 'button', bg, text, ...props }, ref) => {
    return (
      <button
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
              image === '' && 'relative',
            )}
          >
            {text}
          </span>
        )}
        {!bg && image && <img src={imagesMap[image]} alt='' />}
      </button>
    )
  },
)

export { Button }
