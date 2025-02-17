import { useAppContext } from '@/context/use-app-context'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { TIME_WIN_INCREASE_NUMBER } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Logo } from './logo'
import { Balance } from './balance'
import { AddMoneyModal } from './add-money-modal'

export const Header = () => {
  const { balance, bet, state, playAudio } = useAppContext()
  const modal = useCustomModal()

  const handleAddMoney = async () => {
    await playAudio('mouseclick')
    modal.show({
      contentSlot: <AddMoneyModal />,
    })
  }

  return (
    <header className='flex items-center justify-between px-3 py-2'>
      <Logo />
      <Balance
        value={balance}
        increaseTime={state === 'win' ? TIME_WIN_INCREASE_NUMBER : undefined}
        beforeSlot={
          <>
            {/* TODO: ADD FLAG NO_MONEY  */}
            {state === 'preparation' && !(balance > 0 || bet > 0) ? (
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
