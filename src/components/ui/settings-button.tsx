import { useCustomModal } from '@/hooks/use-custom-modal'
import { Settings } from '@/components/settings'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const SettingsButton = () => {
  const modal = useCustomModal()

  const handleSettingsClick = () => {
    modal.show({ contentSlot: <Settings /> })
  }

  return (
    <ButtonWithAudio
      as='button'
      image='settings'
      className='w-10 cursor-pointer bg-center bg-no-repeat p-1.5'
      onClick={handleSettingsClick}
    />
  )
}

export { SettingsButton }
