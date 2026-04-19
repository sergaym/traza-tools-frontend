import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const h = await headers()
  const session = await auth.api.getSession({ headers: h })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const existing = (session.user as { organizationId?: string | null }).organizationId
  if (existing) {
    return NextResponse.json({ error: "already_onboarded" }, { status: 409 })
  }

  const body = (await req.json()) as { org_name?: string }
  const orgName = body.org_name?.trim()
  if (!orgName) {
    return NextResponse.json({ error: "invalid_org_name" }, { status: 400 })
  }

  const bootstrap = process.env.TRAZA_BOOTSTRAP_API_KEY
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!bootstrap || !apiUrl) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 })
  }

  const res = await fetch(`${apiUrl}/v1/organizations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": bootstrap,
    },
    body: JSON.stringify({ name: orgName }),
  })

  if (!res.ok) {
    const detail = await res.text()
    return NextResponse.json({ error: "org_create_failed", detail }, { status: 502 })
  }

  const data = (await res.json()) as {
    organization: { id: string; name: string }
    api_key: { id: string; name: string; key: string }
  }

  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? "http"
  const update = await fetch(`${proto}://${host}/api/auth/update-user`, {
    method: "POST",
    headers: {
      cookie: h.get("cookie") ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizationId: data.organization.id }),
  })
  if (!update.ok) {
    return NextResponse.json({ error: "user_update_failed", detail: await update.text() }, { status: 502 })
  }

  return NextResponse.json({
    organization: data.organization,
    api_key: data.api_key,
  })
}
