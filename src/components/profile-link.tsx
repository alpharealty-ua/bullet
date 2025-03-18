import { useEffect } from 'react'

import { useCustomModal } from '@/hooks/use-custom-modal'
import { Profile } from '@/components/profile'
import { cn } from '@/lib/utils'

interface Props extends React.ComponentProps<'button'> {
  user: User
}

const ProfileLink = ({ className, user, ...props }: Props) => {
  const modal = useCustomModal()

  const handleProfileClick = () => {
    modal.show({ contentSlot: <Profile user={user} /> })
  }

  useEffect(() => {
    return () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    }
  }, [])

  return (
    <button
      className={cn(
        'hover:text-green cursor-pointer transition-all active:scale-90',
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
