import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100),
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: z.string({
      required_error: 'Confirm password is required',
    }),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: 'Passwords must match',
    path: ['passwordConfirm'],
  })

export type RegisterSchema = z.infer<typeof registerSchema>
