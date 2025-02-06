import { useEffect, useState } from 'react'

import { useAppContext } from '@/context/use-app-context'
import { cn } from '@/lib/utils'
import { WalletButton } from './wallet-button'

export const WalletButtonAnimation = () => {
  const { balance, state, changeState } = useAppContext()
  const [hasMoney, setHasMoney] = useState(true)
  const [clickedWallet, setClicketWallet] = useState(false)

  const handleAddMoney = () => {
    setClicketWallet(true)
    changeState('add-money')
  }

  useEffect(() => {
    setHasMoney(balance > 0)
    if (!(balance > 0)) {
      setClicketWallet(false)
    }
  }, [balance])

  return (
    <>
      {!hasMoney ? (
        <span
          className={cn(
            'cursor-pointer text-[40px]',
            !clickedWallet &&
              state === 'bet' &&
              'repeat-infinite animate-[wiggle] duration-1000 ease-linear',
          )}
          onClick={handleAddMoney}
        >
          💀
        </span>
      ) : (
        <WalletButton
          className={cn(
            !hasMoney &&
              !clickedWallet &&
              state === 'bet' &&
              'repeat-infinite animate-[wiggle] duration-1000 ease-linear',
          )}
          onClick={handleAddMoney}
        />
      )}
    </>
  )
}
