import { useEffect } from 'react'

import { useProfile } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { cn } from '@/lib/utils'
import { Profile } from '@/components/profile'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { ButtonProps, OmitTo, OmitUnion } from '@/components/ui/button'

type ProfileLinkProps = OmitUnion<ButtonProps, 'onClick' | 'bg' | 'image'>

const ProfileLink = ({ className, ...props }: OmitTo<ProfileLinkProps>) => {
  const modal = useCustomModal()
  const { data: user } = useProfile()

  const handleProfileClick = async (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    event.preventDefault()

    const targetEl = event.currentTarget

    if (!(targetEl instanceof HTMLElement)) {
      return
    }

    await new Promise((res) => setTimeout(res))

    props.as === 'button'
      ? modal.show({ contentSlot: <Profile /> })
      : targetEl.dispatchEvent(
          new PointerEvent('click', { bubbles: true, cancelable: true }),
        )
  }

  useEffect(() => {
    return () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    }
  }, [])

  if (!user) {
    return null
  }

  const allProps: ProfileLinkProps =
    props.as === 'link'
      ? {
          ...props,
          to: ROUTES.cabinet.profile,
        }
      : { ...props }

  return (
    <ButtonWithAudio
      bg=''
      className={cn(
        'hover:text-green cursor-pointer text-sm leading-[1] font-normal transition-all active:scale-90',
        className,
      )}
      onClick={handleProfileClick}
      {...allProps}
    >
      {user.username}
    </ButtonWithAudio>
  )
}

export { ProfileLink }
