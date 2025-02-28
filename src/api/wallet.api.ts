import { api, QUERY_KEYS } from '@/api/api'
import { useQuery } from '@tanstack/react-query'

interface FetchBalanceResponse {
  balance: {
    amount: string
    formattedAmount: string
  }
  activeSelection?: Record<string, unknown>
}

interface AddBalanceResponse {
  amount: string
}

const routes = {
  balance: '/wallet/balance',
  addBalance: '/wallet/add-balance',
} as const

export const fetchBalance = async (): Promise<FetchBalanceResponse> => {
  const { data } = await api.get<FetchBalanceResponse>(routes.balance)
  return data
}

export const addBalance = async (): Promise<AddBalanceResponse> => {
  const { data } = await api.post<AddBalanceResponse>(routes.addBalance, {
    userId: 'cm7eddum70000o601x9syudxe',
    networkId: 'local',
    coinId: 'usd',
    amount: '100',
    description: 'TEST BALANCE',
  })
  return data
}

export const useBalance = () =>
  useQuery({
    queryKey: [QUERY_KEYS.balance],
    queryFn: fetchBalance,
    select: (data) => Number(data.balance.amount),
    initialData: { balance: { amount: '0', formattedAmount: '0' } },
  })
