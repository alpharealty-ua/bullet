import { useEffect, useState } from 'react'

import { useAppContext } from '@/context/use-app-context'
import { cn } from '@/lib/utils'
import { WalletButton } from './wallet-button'

export const WalletButtonAnimation = () => {
  const { total, state, setState } = useAppContext()
  const [hasMoney, setHasMoney] = useState(true)
  const [clickedWallet, setClicketWallet] = useState(false)

  const handleAddMoney = () => {
    setClicketWallet(true)
    setState('add-money')
  }

  useEffect(() => {
    setHasMoney(total > 0)
    if (!(total > 0)) {
      setClicketWallet(false)
    }
  }, [total])

  return (
    <>
      {!hasMoney ? (
        <span
          className={cn(
            'text-[40px]',
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
