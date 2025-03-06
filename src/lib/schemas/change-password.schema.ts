import { z } from 'zod'

export const changePasswordSchema = z
  .object({
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: 'Passwords must match',
    path: ['passwordConfirm'],
  })

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
