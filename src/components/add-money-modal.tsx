import { useAppContext } from '@/context/use-app-context'
import { AddMoney } from './add-money'

export const AddMoneyModal = () => {
  const { balance, addBalance } = useAppContext()

  return <AddMoney balance={balance} onAddMoney={addBalance} />
}
