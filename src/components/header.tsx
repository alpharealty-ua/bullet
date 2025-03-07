import { useUser } from '@/api/auth.api'
import { useBalance } from '@/api/wallet.api'
import { useSoloStore } from '@/store/solo.store'
import { Logo } from '@/components/logo'
import { Balance } from '@/components/balance'
import { MoneyBagButton } from '@/components/money-bag-button'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { Profile } from './profile'

export const Header = ({
  logoText,
  hideBalance = false,
}: {
  logoText?: string
  hideBalance?: boolean
}) => {
  const { data: balance, isLoading } = useBalance()
  const user = useUser()
  const noMoney = useSoloStore(({ noMoney }) => noMoney)
  const increaseTime = useSoloStore(({ increaseTime }) => increaseTime)
  const modal = useCustomModal()

  const handleProfileClick = () => {
    modal.show({ contentSlot: <Profile /> })
  }

  return (
    <header className='flex items-center justify-between px-3 py-2'>
      <Logo as='link' to='/' text={logoText} />
      <div className='flex flex-col gap-1'>
        <button
          onClick={handleProfileClick}
          className='cursor-pointer self-end'
        >
          {user.username}
        </button>
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
