import { IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import React from 'react'
import { Link } from 'react-router'

const LeadboardIcon = ({
  className,
  ...props
}: React.ComponentProps<typeof Link>) => {
  return (
    <Link
      className={cn(
        'aspect-[176/186] h-20 w-20 bg-contain bg-center bg-no-repeat',
        className,
      )}
      style={{
        backgroundImage: `url(${IMAGES.leaderboardstar})`,
      }}
      {...props}
    ></Link>
  )
}

export { LeadboardIcon }
