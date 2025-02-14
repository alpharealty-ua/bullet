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
}

const Logo = ({ size = 'md' }: LogoProps) => {
  return (
    <div
      className={cn(
        'relative inline-flex bg-contain bg-center bg-no-repeat',
        sizes[size],
      )}
    >
      <div
        className='absolute top-[33%] left-[25%] aspect-square w-[17%] bg-contain bg-no-repeat'
        style={{ backgroundImage: `url(${images.logobullet})` }}
      ></div>
      <img src={images.logo} alt='' />
    </div>
  )
}

export { Logo }
