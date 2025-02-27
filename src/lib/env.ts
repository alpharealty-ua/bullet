import { z } from 'zod'

const schema = z.object({
  BULLET_API_URL: z.string().url(),
})

const env = schema.parse(import.meta.env)

export const ENV = {
  API_URL: env.BULLET_API_URL,
}
