import { useCustomModal } from '@/hooks/use-custom-modal'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { ButtonProps } from '@/components/ui/button'
import { AddMoneyModal } from '@/components/add-money-modal'
import { cn } from '@/lib/utils'

const MoneyBagButton = ({
  balance,
  noMoney,
  className,
  ...props
}: ButtonProps & { balance: number; noMoney: boolean }) => {
  const modal = useCustomModal()

  const handleAddMoney = async () => {
    modal.show({
      contentSlot: <AddMoneyModal />,
    })
  }

  return (
    <>
      <ButtonWithAudio
        className={cn(
          '',
          !noMoney && 'w-8',
          noMoney && 'animate-wiggle text-4xl',
          className,
        )}
        image={noMoney ? '' : 'moneybag'}
        onClick={handleAddMoney}
        text={noMoney ? '💀' : ''}
        {...props}
      />
    </>
  )
}

export { MoneyBagButton }
