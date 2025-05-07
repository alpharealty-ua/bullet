import { useCustomModal } from '@/hooks/use-custom-modal'
import { cn } from '@/lib/utils'
import { Settings } from '@/components/settings'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { ButtonProps } from '@/components/ui/button'

type PickAsButton<T> = T extends { as: 'button' } ? T : never

type SettingsProps = Omit<PickAsButton<ButtonProps>, 'as' | 'image' | 'bg'>

const SettingsButton = ({ className, ...props }: SettingsProps) => {
  const modal = useCustomModal()

  const handleSettingsClick = () => {
    modal.show({ contentSlot: <Settings /> })
  }

  return (
    <ButtonWithAudio
      as='button'
      image='settings'
      className={cn(
        'w-10 cursor-pointer bg-center bg-no-repeat p-1.5',
        className,
      )}
      onClick={handleSettingsClick}
      {...props}
    />
  )
}

export { SettingsButton }
