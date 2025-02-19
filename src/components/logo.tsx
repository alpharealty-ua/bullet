import React from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Link, LinkProps } from 'react-router'

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
  HTMLAnchorElement,
  React.RefAttributes<HTMLAnchorElement> & LinkProps & LogoProps
>(({ size = 'md', text, ...props }, ref) => {
  return (
    <Link
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
        <div
          className={cn(
            'animate-in fade-in text-red absolute top-full left-full -mt-[10%] -ml-[10%] text-lg italic duration-500',
            size === 'lg' && 'text-xl',
            size === '3xl' && 'text-4xl',
          )}
        >
          {text}
        </div>
      )}
    </Link>
  )
})

export { Logo }
