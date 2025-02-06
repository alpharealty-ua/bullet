import { useAppContext } from '@/context/use-app-context'
import { Logo } from './logo'
import { Balance } from './balance'

export const Header = () => {
  const { balance, bet, state } = useAppContext()

  return (
    <header className='flex items-center justify-between px-3 py-2'>
      <Logo />
      <Balance
        value={balance - (state === 'bet' || state === 'pull-start' ? 0 : bet)}
      />
    </header>
  )
}
