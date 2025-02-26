import { useEffect, useState } from 'react'

import { useAppContext } from '@/context/use-app-context'
import { TIME_WIN_INCREASE_NUMBER } from '@/lib/constants'
import { Logo } from './logo'
import { Balance } from './balance'
import { MoneyBagButton } from './money-bag-button'

export const Header = ({
  logoText,
  hideBalance = false,
}: {
  logoText?: string
  hideBalance?: boolean
}) => {
  const { balance, state } = useAppContext()
  const [balanceWithDelay, setBalanceWithDelay] = useState(balance)

  useEffect(() => {
    if (balance === balanceWithDelay) {
      return
    }

    const changeBalance = () => setBalanceWithDelay(balance)

    if (state !== 'win') {
      changeBalance()
      return
    }

    // TODO: ADD SUBSCRIPT WINSOUND
    const timeoutID = setTimeout(changeBalance, 1000)

    return () => {
      clearTimeout(timeoutID)
    }
  }, [balance, state, balanceWithDelay])

  return (
    <header className='flex items-center justify-between px-3 py-2'>
      <Logo to='/' text={logoText} />
      {!hideBalance && (
        <Balance
          value={balanceWithDelay}
          increaseTime={state === 'win' ? TIME_WIN_INCREASE_NUMBER : undefined}
          beforeSlot={<MoneyBagButton />}
        />
      )}
    </header>
  )
}
