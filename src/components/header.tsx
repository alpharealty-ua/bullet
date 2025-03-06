import { useBalance } from '@/api/wallet.api'
import { useSoloStore } from '@/store/solo.store'
import { Logo } from '@/components/logo'
import { Balance } from '@/components/balance'
import { MoneyBagButton } from '@/components/money-bag-button'

export const Header = ({
  logoText,
  hideBalance = false,
}: {
  logoText?: string
  hideBalance?: boolean
}) => {
  const { data: balance, isLoading } = useBalance()
  const noMoney = useSoloStore(({ noMoney }) => noMoney)
  const increaseTime = useSoloStore(({ increaseTime }) => increaseTime)

  return (
    <header className='flex items-center justify-between px-3 py-2'>
      <Logo as='link' to='/' text={logoText} />
      {!hideBalance && !isLoading && (
        <div className='flex gap-1'>
          <MoneyBagButton balance={balance} noMoney={noMoney} />
          <Balance value={balance} increaseTime={increaseTime} />
        </div>
      )}
    </header>
  )
}
