import classNames from 'classnames'

import { images } from '@/lib/constants'

type LogoSize = 'md' | 'lg' | '3xl'

const sizes = {
  md: ' w-[141px]',
  lg: ' w-[171px]',
  '3xl': 'w-[270px]',
} satisfies Record<LogoSize, string>

interface LogoProps {
  size?: LogoSize
}

const Logo = ({ size = 'md' }: LogoProps) => {
  return (
    <div
      className={classNames(
        'inline-flex aspect-[1/0.333] bg-contain bg-center bg-no-repeat',
        sizes[size],
      )}
      style={{ backgroundImage: `url(${images.logo})` }}
    ></div>
  )
}

export { Logo }
