import { useAppContext } from '@/context/use-app-context'
import { Logo } from './logo'
import { Balance } from './balance'
import { WalletButtonAnimation } from './wallet-button-animation'

export const Header = () => {
  const { balance } = useAppContext()

  return (
    <header className='flex items-center justify-between px-3 py-2'>
      <Logo />
      <Balance value={balance} beforeSlot={<WalletButtonAnimation />} />
    </header>
  )
}
