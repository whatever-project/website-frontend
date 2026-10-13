import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url({
    message: "NEXT_PUBLIC_API_URL must be a valid URL (e.g. https://api.example.com)",
  }),
})

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})

if (!parsed.success) {
  console.error("❌ Invalid environment variables:\n", parsed.error.flatten().fieldErrors)
  throw new Error("Invalid environment variables — check .env.example")
}

export const env = {
  API_URL: parsed.data.NEXT_PUBLIC_API_URL,
} as const
