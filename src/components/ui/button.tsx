import React from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

const imagesMap = {
  button: images.button,
  play: images.play,
  pull: images.pull,
  deal: images.deal,
  duel: images.duel,
  watch: images.watch,
  gamerules: images.gamerules,
  close: images.close,
  moneybag: images.moneybag,
}

// ADD ON CLICK WRAPPER FOR AUDIO
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    image?: keyof typeof imagesMap
    bg?: 'green' | 'red'
    text?: string
  }
>(({ className, image = 'button', bg, text, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'relative inline-flex cursor-pointer items-center justify-center bg-contain bg-center bg-no-repeat text-3xl font-bold transition-transform active:scale-75 disabled:scale-100 disabled:cursor-not-allowed',
        bg && 'rounded-md border-2 border-black px-4 py-1 text-2xl',
        bg === 'green' && 'bg-green text-white',
        bg === 'red' && 'bg-red text-white',
        className,
      )}
      {...props}
    >
      {text && (
        <span
          className={cn(
            !bg && 'absolute inset-0 inline-flex items-center justify-center',
          )}
        >
          {text}
        </span>
      )}
      {!bg && <img src={imagesMap[image]} alt='' />}
    </button>
  )
})

export { Button }
