import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional(),
  // TODO: ADD ENUM
  status: z.string(),
  username: z.string(),
})

export type UserSchema = z.infer<typeof userSchema>
