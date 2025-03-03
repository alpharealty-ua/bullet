import { useCustomModal } from '@/hooks/use-custom-modal'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { ButtonProps } from '@/components/ui/button'
import { AddMoneyModal } from '@/components/add-money-modal'

const MoneyBagButton = ({
  balance,
  noMoney,
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
      {noMoney ? (
        <span
          className='animate-wiggle cursor-pointer text-[40px]'
          onClick={handleAddMoney}
        >
          💀
        </span>
      ) : (
        <ButtonWithAudio
          className='w-8'
          image='moneybag'
          onClick={handleAddMoney}
          {...props}
        />
      )}
    </>
  )
}

export { MoneyBagButton }
