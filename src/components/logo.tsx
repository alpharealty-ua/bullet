import React from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

type LogoSize = 'md' | 'lg' | '3xl'

const sizes = {
  md: ' w-[141px]',
  lg: ' w-[171px]',
  '3xl': 'w-[270px]',
} satisfies Record<LogoSize, string>

interface LogoProps {
  size?: LogoSize
  text?: string
}

const Logo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & LogoProps
>(({ size = 'md', text, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative inline-flex bg-contain bg-center bg-no-repeat',
        sizes[size],
        Boolean(props.onClick) && 'cursor-pointer',
      )}
      {...props}
    >
      <div
        className='absolute top-[33%] left-[25.5%] aspect-square w-[17%] -rotate-5 bg-contain bg-no-repeat'
        style={{ backgroundImage: `url(${images.bullet})` }}
      ></div>
      <img src={images.logo} alt='' />
      {text && (
        <div className='animate-in fade-in text-red absolute top-full left-full -mt-8 -ml-8 text-4xl italic duration-500'>
          {text}
        </div>
      )}
    </div>
  )
})

export { Logo }
