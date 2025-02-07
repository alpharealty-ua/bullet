import { useAppContext } from '@/context/use-app-context'
import { cn } from '@/lib/utils'
import { WalletButton } from './wallet-button'

export const WalletButtonAnimation = () => {
  const { balance, bet, state, changeState } = useAppContext()

  const handleAddMoney = () => {
    changeState('add-money')
  }

  return (
    <>
      {state === 'bet' && !(balance > 0 || bet > 0) ? (
        <span
          className={cn(
            'cursor-pointer text-[40px]',
            'repeat-infinite animate-[wiggle] duration-1000 ease-linear',
          )}
          onClick={handleAddMoney}
        >
          💀
        </span>
      ) : (
        <WalletButton onClick={handleAddMoney} />
      )}
    </>
  )
}
