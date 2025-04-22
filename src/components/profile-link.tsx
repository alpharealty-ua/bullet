import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { useProfile } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { cn } from '@/lib/utils'
import { Profile } from '@/components/profile'

interface ProfileLinkProps extends React.ComponentProps<'button'> {
  isModal?: boolean
}

const ProfileLink = ({ className, isModal, ...props }: ProfileLinkProps) => {
  const modal = useCustomModal()
  const { data: user } = useProfile()
  const navigate = useNavigate()

  const handleProfileClick = () => {
    if (!user) {
      return
    }

    isModal
      ? modal.show({ contentSlot: <Profile user={user} /> })
      : navigate(ROUTES.cabinet.profile)
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
    // TODO: ADD MOUSE CLICK
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
