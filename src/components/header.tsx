import { Logo } from './logo'
import { Balance } from './balance'
import { useAppContext } from '../context/use-app-context'

export const Header = () => {
  const { total } = useAppContext()

  return (
    <div className='flex justify-between px-3 py-2'>
      <Logo />
      <Balance value={total} />
    </div>
  )
}
