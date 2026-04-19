import { SignJWT } from "jose"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"

async function provisionOrg(
  userId: string,
  userName: string,
  apiUrl: string,
  bootstrapKey: string,
  sessionHeaders: Headers,
): Promise<string | null> {
  const res = await fetch(`${apiUrl}/v1/organizations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-Key": bootstrapKey },
    body: JSON.stringify({ name: `${userName}'s workspace` }),
  })
  if (!res.ok) return null

  const data = (await res.json()) as { organization: { id: string } }
  const orgId = data.organization.id

  const host = sessionHeaders.get("x-forwarded-host") ?? sessionHeaders.get("host") ?? "localhost:3000"
  const proto = sessionHeaders.get("x-forwarded-proto") ?? "http"

  await fetch(`${proto}://${host}/api/auth/update-user`, {
    method: "POST",
    headers: {
      cookie: sessionHeaders.get("cookie") ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizationId: orgId }),
  })

  return orgId
}

export async function GET() {
  const h = await headers()
  const session = await auth.api.getSession({ headers: h })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const secret = process.env.TRAZA_API_JWT_SECRET
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const bootstrapKey = process.env.TRAZA_BOOTSTRAP_API_KEY
  if (!secret || !apiUrl || !bootstrapKey) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 })
  }

  let orgId = (session.user as { organizationId?: string | null }).organizationId ?? null

  if (!orgId) {
    orgId = await provisionOrg(session.user.id, session.user.name, apiUrl, bootstrapKey, h)
    if (!orgId) {
      return NextResponse.json({ error: "workspace_creation_failed" }, { status: 502 })
    }
  }

  const token = await new SignJWT({
    sub: session.user.id,
    organization_id: orgId,
    email: session.user.email,
    name: session.user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(new TextEncoder().encode(secret))

  return NextResponse.json({ token })
}
