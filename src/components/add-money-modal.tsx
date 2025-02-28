import { AddMoney } from './add-money'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addBalance, useBalance } from '@/api/wallet.api'
import { QUERY_KEYS } from '@/api/api'

export const AddMoneyModal = () => {
  const queryClient = useQueryClient()
  const { data: balance } = useBalance()

  const { mutateAsync: addBalanceMutation } = useMutation({
    mutationFn: addBalance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
    },
  })

  const handleAddMoney = async () => {
    await addBalanceMutation()
  }

  return <AddMoney balance={balance} onAddMoney={handleAddMoney} />
}
