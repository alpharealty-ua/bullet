import { useCustomModal } from '@/hooks/use-custom-modal'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { ButtonProps } from '@/components/ui/button'
import { AddMoneyModal } from '@/components/add-money-modal'
import { cn } from '@/lib/utils'

const MoneyBagButton = ({
  balance,
  noMoney,
  className,
  bg,
  text,
  image,
  ...props
}: ButtonProps & {
  balance: number
  noMoney: boolean
}) => {
  const modal = useCustomModal()

  const handleAddMoney = async () => {
    modal.show({
      contentSlot: <AddMoneyModal />,
    })
  }

  return (
    <ButtonWithAudio
      className={cn(
        'aspect-[8/12] w-8',
        noMoney && 'animate-wiggle text-4xl',
        className,
      )}
      {...(noMoney ? { bg: '', text: '💀' } : { image: 'moneybag' })}
      onClick={handleAddMoney}
      {...props}
    />
  )
}

export { MoneyBagButton }
