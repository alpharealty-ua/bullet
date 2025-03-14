import { useCustomModal } from '@/hooks/use-custom-modal'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { ButtonProps } from '@/components/ui/button'
import { AddMoneyModal } from '@/components/add-money-modal'
import { cn } from '@/lib/utils'

const MoneyBagButton = ({
  balance,
  noMoney,
  className,
  text,
  image,
  bg,
  ...props
}: ButtonProps & { balance: number; noMoney: boolean }) => {
  const modal = useCustomModal()

  const handleAddMoney = async () => {
    modal.show({
      contentSlot: <AddMoneyModal />,
    })
  }

  return (
    <ButtonWithAudio
      className={cn(
        '',
        !noMoney && 'w-8',
        noMoney && 'animate-wiggle text-4xl',
        className,
      )}
      image={noMoney ? undefined : 'moneybag'}
      text={noMoney ? '💀' : undefined}
      onClick={handleAddMoney}
      {...props}
    />
  )
}

export { MoneyBagButton }
