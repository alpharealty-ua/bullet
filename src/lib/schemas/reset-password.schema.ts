import { z } from 'zod'

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: z.string({
    required_error: 'Confirm password is required',
  }),
  token: z.string()
    .min(1, 'Token is required')
}).refine(({ newPassword, passwordConfirm }) => newPassword === passwordConfirm, {
  message: 'Passwords must match',
  path: ['passwordConfirm'],
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
