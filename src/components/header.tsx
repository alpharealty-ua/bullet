import { useAppContext } from '@/context/use-app-context'
import { TIME_WIN_INCREASE_NUMBER } from '@/lib/constants'
import { Logo } from './logo'
import { BalanceWithDelay } from './balance'
import { MoneyBagButton } from './money-bag-button'
import { useBalance } from '@/api/wallet.api'

export const Header = ({
  logoText,
  hideBalance = false,
}: {
  logoText?: string
  hideBalance?: boolean
}) => {
  const { state } = useAppContext()
  const { data: balance, isLoading } = useBalance()

  return (
    <header className='flex items-center justify-between px-3 py-2'>
      <Logo to='/' text={logoText} />
      {!hideBalance && !isLoading && (
        <BalanceWithDelay
          hasDelay={state === 'win'}
          value={balance}
          increaseTime={state === 'win' ? TIME_WIN_INCREASE_NUMBER : undefined}
          beforeSlot={<MoneyBagButton balance={balance} />}
        />
      )}
    </header>
  )
}
