import { useCustomModal } from '@/hooks/use-custom-modal'
import { Profile } from '@/components/profile'

const ProfileLink = ({ name }: { name: string }) => {
  const modal = useCustomModal()

  const handleProfileClick = () => {
    modal.show({ contentSlot: <Profile /> })
  }

  return (
    <button
      className='hover:text-green cursor-pointer self-end transition-all active:scale-90'
      onClick={handleProfileClick}
    >
      {name}
    </button>
  )
}

export { ProfileLink }
