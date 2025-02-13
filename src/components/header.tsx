import { useAppContext } from '@/context/use-app-context'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Logo } from './logo'
import { Balance } from './balance'

export const Header = () => {
  const { balance, bet, state, changeState } = useAppContext()

  const handleAddMoney = () => {
    changeState('add-money')
  }

  return (
    <header className='flex items-center justify-between px-3 py-2'>
      <Logo />
      <Balance
        value={balance}
        beforeSlot={
          <>
            {state === 'pull' && !(balance > 0 || bet > 0) ? (
              <span
                className={cn(
                  'cursor-pointer text-[40px]',
                  'repeat-infinite animate-[wiggle] duration-1000 ease-linear',
                )}
                onClick={handleAddMoney}
              >
                💀
              </span>
            ) : (
              <Button
                className='w-8'
                image='moneybag'
                onClick={handleAddMoney}
              />
            )}
          </>
        }
      />
    </header>
  )
}
