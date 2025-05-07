import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { useProfile } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { cn } from '@/lib/utils'
import { Profile } from '@/components/profile'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

interface ProfileLinkProps extends React.ComponentProps<'button'> {
  isModal?: boolean
}

const ProfileLink = ({ className, isModal, ...props }: ProfileLinkProps) => {
  const modal = useCustomModal()
  const { data: user } = useProfile()
  const navigate = useNavigate()

  const handleProfileClick = () => {
    isModal
      ? modal.show({ contentSlot: <Profile /> })
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
    <ButtonWithAudio
      as='button'
      bg=''
      className={cn(
        'hover:text-green cursor-pointer text-sm leading-[1] font-normal transition-all active:scale-90',
        className,
      )}
      onClick={handleProfileClick}
      {...props}
    >
      {user.username}
    </ButtonWithAudio>
  )
}

export { ProfileLink }
