import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { Pool } from "pg"

import { nodePostgresUrl } from "@/lib/db-url"

const connectionString = nodePostgresUrl(process.env.DATABASE_URL)

export const pool = new Pool({
  connectionString,
  max: 10,
})

const appUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const auth = betterAuth({
  database: pool,
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "dev-only-set-BETTER_AUTH_SECRET-in-env-at-least-32-chars",
  baseURL: appUrl,
  emailAndPassword: { enabled: true },
  trustedOrigins: (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  user: {
    additionalFields: {
      organizationId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
})
