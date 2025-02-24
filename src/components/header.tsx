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

  return (
    <header className='flex items-center justify-between px-3 py-2'>
      <Logo to='/' text={logoText} />
      {!hideBalance && (
        <Balance
          value={balance}
          increaseTime={state === 'win' ? TIME_WIN_INCREASE_NUMBER : undefined}
          beforeSlot={<MoneyBagButton />}
        />
      )}
    </header>
  )
}
