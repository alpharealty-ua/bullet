import { useEffect, useState } from 'react'

import { useAppContext } from '@/context/use-app-context'
import { cn } from '@/lib/utils'
import { WalletButton } from './wallet-button'

export const WalletButtonAnimation = () => {
  const { total, state } = useAppContext()
  const [hasMoney, setHasMoney] = useState(true)
  const [clickedWallet, setClicketWallet] = useState(false)

  const handleAddMoney = () => {
    setClicketWallet(true)
  }

  useEffect(() => {
    setHasMoney(total > 0)
    if (!(total > 0)) {
      setClicketWallet(false)
    }
  }, [total])

  return (
    <WalletButton
      className={cn(
        !hasMoney &&
          !clickedWallet &&
          state === 'bet' &&
          'repeat-infinite animate-[wiggle] duration-1000 ease-linear',
      )}
      onClick={handleAddMoney}
    />
  )
}
