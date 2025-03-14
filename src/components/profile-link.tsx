import { useCustomModal } from '@/hooks/use-custom-modal'
import { Profile } from '@/components/profile'
import { cn } from '@/lib/utils'

interface Props extends React.ComponentProps<'button'> {
  name: string
}

const ProfileLink = ({ name, className, ...props }: Props) => {
  const modal = useCustomModal()

  const handleProfileClick = () => {
    modal.show({ contentSlot: <Profile /> })
  }

  return (
    <button
      className={cn(
        'hover:text-green cursor-pointer transition-all active:scale-90',
        className,
      )}
      onClick={handleProfileClick}
      {...props}
    >
      {name}
    </button>
  )
}

export { ProfileLink }
