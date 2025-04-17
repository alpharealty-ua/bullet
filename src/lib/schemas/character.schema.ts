import { z } from 'zod'

import { characterNameList } from '@/lib/constants'
import { networkSchema, coinSchema } from '@/lib/schemas/wallet.schema'

export const characterSchema = z.object({
  id: z.enum(characterNameList),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  isFree: z.boolean(),
  price: z.string(),
  coinId: z.string(),
  networkId: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  formattedPrice: z.string().or(z.number()),
  network: networkSchema,
  coin: coinSchema,
})

export const userCharacterSchema = characterSchema.merge(
  z.object({ purchased: z.boolean() }),
)

export const characterSchemaArray = z.array(characterSchema)

export const userCharacterSchemaArray = z.array(userCharacterSchema)

export type CharacterSchema = z.infer<typeof characterSchema>

export type UserCharacterSchema = z.infer<typeof userCharacterSchema>

export type CharacterListSchema = z.infer<typeof characterSchemaArray>

export type UserCharacterListSchema = z.infer<typeof userCharacterSchemaArray>
