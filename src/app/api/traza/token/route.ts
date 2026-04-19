import { SignJWT } from "jose"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"

export async function GET() {
  const h = await headers()
  const session = await auth.api.getSession({ headers: h })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const secret = process.env.TRAZA_API_JWT_SECRET
  if (!secret) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 })
  }

  const orgId = (session.user as { organizationId?: string | null }).organizationId ?? null
  if (!orgId) {
    return NextResponse.json({ error: "workspace_required" }, { status: 403 })
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
