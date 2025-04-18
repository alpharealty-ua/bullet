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

export type NetworkSchema = z.infer<typeof networkSchema>

export type CoinSchema = z.infer<typeof coinSchema>
