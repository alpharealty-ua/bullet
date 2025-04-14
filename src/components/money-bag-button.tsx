import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { ButtonProps } from '@/components/ui/button'
import { useShowAddMoneyModal } from '@/hooks/use-add-money-modal'
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
  const showAddMoneyModal = useShowAddMoneyModal()

  const handleAddMoney = showAddMoneyModal

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
