import { useEffect } from 'react'

import { useProfile } from '@/api/auth.api'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { cn } from '@/lib/utils'
import { Profile } from '@/components/profile'

type Props = React.ComponentProps<'button'>

const ProfileLink = ({ className, ...props }: Props) => {
  const modal = useCustomModal()
  const { data: user } = useProfile()

  const handleProfileClick = () => {
    if (!user) {
      return
    }

    modal.show({ contentSlot: <Profile user={user} /> })
  }

  useEffect(() => {
    return () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    }
  }, [])

  if (!user) {
    return null
  }

  return (
    <button
      className={cn(
        'hover:text-green cursor-pointer leading-[1] transition-all active:scale-90',
        className,
      )}
      onClick={handleProfileClick}
      {...props}
    >
      {user.username}
    </button>
  )
}

export { ProfileLink }
