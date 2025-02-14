import { useAppContext } from '@/context/use-app-context'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Logo } from './logo'
import { Balance } from './balance'

export const Header = () => {
  const { balance, state, changeState, playAudio } = useAppContext()

  const handleAddMoney = async () => {
    await playAudio('mouseclick')
    changeState('add-money')
  }

  return (
    <header className='flex items-center justify-between px-3 py-2'>
      <Logo />
      <Balance
        value={balance}
        beforeSlot={
          <>
            {state === 'preparation' && !(balance > 0) ? (
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
