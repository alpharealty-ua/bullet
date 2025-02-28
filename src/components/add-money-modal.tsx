import { AddMoney } from './add-money'
import { useAddBalance, useBalance } from '@/api/wallet.api'

export const AddMoneyModal = () => {
  const { data: balance } = useBalance()
  const { mutateAsync: addBalanceMutation } = useAddBalance()

  const handleAddMoney = async () => {
    await addBalanceMutation(100)
  }

  return <AddMoney balance={balance} onAddMoney={handleAddMoney} />
}
