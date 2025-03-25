import { useBalance } from '@/api/wallet.api'
import { useGameStore } from '@/store/game.store'
import { Logo } from '@/components/logo'
import { Balance } from '@/components/balance'
import { MoneyBagButton } from '@/components/money-bag-button'
import { ProfileLink } from '@/components/profile-link'

export const Header = ({
  logoText,
  headerProfile = false,
}: {
  logoText?: string
  headerProfile?: boolean
}) => {
  const { data: balance, isLoading } = useBalance()

  const noMoney = useGameStore(({ noMoney }) => noMoney)
  const increaseTime = useGameStore(({ increaseTime }) => increaseTime)

  return (
    <header className='flex min-h-18 items-center justify-between px-3 py-2'>
      <Logo as='link' to='/' text={logoText} />
      <div className='flex flex-col gap-1'>
        {!headerProfile && <ProfileLink className='self-end' />}
        {!isLoading && (
          <div className='flex gap-1'>
            <MoneyBagButton
              as='button'
              balance={balance}
              noMoney={noMoney}
              className='w-7 self-end'
              bg=''
            />
            <div className='relative flex flex-col items-end gap-1 self-start'>
              <div className='text-green text-center text-xl leading-[1] tracking-tight uppercase'>
                Balance
              </div>
              <Balance value={balance} increaseTime={increaseTime} />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
