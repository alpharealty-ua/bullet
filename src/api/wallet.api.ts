import { api } from '@/api/api'

interface BalanceResponse {
  balance: {
    amount: string
    formattedAmount: string
  }
  activeSelection?: Record<string, unknown>
}

const routes = {
  balance: '/wallet/balance',
} as const

export const fetchBalance = async (): Promise<BalanceResponse> => {
  const { data } = await api.get<BalanceResponse>(routes.balance)
  return data
}
