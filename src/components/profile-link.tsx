import { useCustomModal } from '@/hooks/use-custom-modal'
import { Profile } from '@/components/profile'

interface Props extends React.ComponentProps<'button'> {
  name: string
}

const ProfileLink = ({ name, ...props }: Props) => {
  const modal = useCustomModal()

  const handleProfileClick = () => {
    modal.show({ contentSlot: <Profile /> })
  }

  return (
    <button
      className='hover:text-green cursor-pointer transition-all active:scale-90'
      onClick={handleProfileClick}
      {...props}
    >
      {name}
    </button>
  )
}

export { ProfileLink }
