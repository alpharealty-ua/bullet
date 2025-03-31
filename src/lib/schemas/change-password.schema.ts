import { z } from 'zod'

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be more than 6 characters'),
    passwordConfirm: z.string({
      required_error: 'Confirm password is required',
    }),
  })
  .refine(({ newPassword: password, passwordConfirm }) => password === passwordConfirm, {
    message: 'Passwords must match',
    path: ['passwordConfirm'],
  })

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
