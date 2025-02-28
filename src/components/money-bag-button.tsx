import { useCustomModal } from '@/hooks/use-custom-modal'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { ButtonProps } from '@/components/ui/button'
import { AddMoneyModal } from './add-money-modal'
import { useAppContext } from '@/context/use-app-context'

const MoneyBagButton = ({
  balance,
  ...props
}: ButtonProps & { balance: number }) => {
  const { bet, state } = useAppContext()
  const modal = useCustomModal()
  /* TODO: ADD FLAG NO_MONEY  */
  const noMoney = state === 'preparation' && !(balance > 0 || bet > 0)

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
