import { useBalance } from '@/api/wallet.api'
import { AddMoney } from '@/components/add-money'

export const AddMoneyModal = () => {
  const { data: balance } = useBalance()

  return <AddMoney balance={balance} />
}
