import React from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Link, LinkProps } from 'react-router'

type LogoSize = 'md' | 'lg' | 'xl'

const sizes = {
  md: ' w-[141px]',
  lg: ' w-[171px]',
  xl: 'w-[270px]',
} satisfies Record<LogoSize, string>

interface LogoProps {
  size?: LogoSize
  text?: string
}

const Logo = ({
  size = 'md',
  text,
  ...props
}: (
  | ({ as: 'link' } & LinkProps & React.HTMLAttributes<HTMLAnchorElement>)
  | ({ as?: 'button' } & React.HTMLAttributes<HTMLButtonElement>)
) &
  LogoProps) => {
  const { as, ...componentProps } = props
  // eslint-disable-next-line
  const Comp: any = as === 'link' ? Link : 'button'

  return (
    <Comp
      className={cn(
        'relative inline-flex bg-contain bg-center bg-no-repeat',
        sizes[size],
        Boolean(componentProps.onClick) && 'cursor-pointer',
      )}
      {...componentProps}
    >
      <div
        className='absolute top-[33%] left-[25.5%] aspect-square w-[17%] -rotate-5 bg-contain bg-no-repeat'
        style={{ backgroundImage: `url(${images.bullet})` }}
      ></div>
      <img src={images.logo} alt='' />
      {text && (
        <div
          className={cn(
            'fill-mode-both animate-in fade-in text-red absolute top-full left-full -mt-[15%] -ml-[15%] text-2xl italic duration-500',
            size === 'lg' && 'text-3xl',
            size === 'xl' && '-mt-[13%] text-4xl',
          )}
        >
          {text}
        </div>
      )}
    </Comp>
  )
}

export { Logo }
