import { useUser } from '@/api/auth.api'
import { useBalance } from '@/api/wallet.api'
import { useGameStore } from '@/store/game.store'
import { Logo } from '@/components/logo'
import { Balance } from '@/components/balance'
import { MoneyBagButton } from '@/components/money-bag-button'
import { ProfileLink } from '@/components/profile-link'

export const Header = ({
  logoText,
  hideBalance = false,
}: {
  logoText?: string
  hideBalance?: boolean
}) => {
  const { data: balance, isLoading } = useBalance()
  const user = useUser()
  const noMoney = useGameStore(({ noMoney }) => noMoney)
  const increaseTime = useGameStore(({ increaseTime }) => increaseTime)

  return (
    <header className='flex items-center justify-between px-3 py-2'>
      <Logo as='link' to='/' text={logoText} />
      <div className='flex flex-col gap-1'>
        <ProfileLink name={user.username} />
        {!hideBalance && !isLoading && (
          <div className='flex items-end gap-1'>
            <MoneyBagButton
              balance={balance}
              noMoney={noMoney}
              className='self-end'
            />
            <Balance value={balance} increaseTime={increaseTime} />
          </div>
        )}
      </div>
    </header>
  )
}
