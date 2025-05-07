import { z } from 'zod'

export const networkSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  isDefault: z.boolean(),
  status: z.string(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
})

export const coinSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  type: z.string(),
  decimals: z.number(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
})

export const balanceSchema = z.object({
  balance: z.object({
    amount: z.string(),
    lockedAmount: z.string(),
    formattedAmount: z.number(),
    formattedLockedAmount: z.number(),
  }),
  activeSelection: z.record(z.unknown()).optional(),
})

export type NetworkSchema = z.infer<typeof networkSchema>

export type CoinSchema = z.infer<typeof coinSchema>

export type BalanceSchema = z.infer<typeof balanceSchema>
