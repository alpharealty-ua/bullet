import { useAppContext } from '@/context/use-app-context'
import { Logo } from './logo'
import { Balance } from './balance'

export const Header = () => {
  const { total, bet } = useAppContext()

  return (
    <div className='flex items-center justify-between px-3 py-2'>
      <Logo />
      <Balance value={total - bet} />
    </div>
  )
}
