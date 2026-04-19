import type { ApiError } from "@/lib/types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

type RequestOptions = {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
}

let cachedToken: { token: string; expMs: number } | null = null

function jwtExpMs(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp?: number }
    return payload.exp ? payload.exp * 1000 : 0
  } catch {
    return 0
  }
}

export function clearTrazaTokenCache() {
  cachedToken = null
}

async function getTrazaBearerToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null
  }
  const now = Date.now()
  if (cachedToken && cachedToken.expMs > now + 30_000) {
    return cachedToken.token
  }
  const r = await fetch(`${window.location.origin}/api/traza/token`, { credentials: "include" })
  if (!r.ok) {
    cachedToken = null
    return null
  }
  const { token } = (await r.json()) as { token: string }
  const expMs = jwtExpMs(token)
  cachedToken = {
    token,
    expMs: expMs || now + 14 * 60 * 1000,
  }
  return token
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`, typeof window !== "undefined" ? window.location.origin : undefined)

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (typeof window !== "undefined") {
    const t = await getTrazaBearerToken()
    if (t) {
      headers.Authorization = `Bearer ${t}`
    }
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    credentials: "include",
  })

  if (!response.ok) {
    let errorBody: Partial<ApiError> = {}
    try {
      errorBody = await response.json()
    } catch {
      // non-JSON error body
    }
    const detail = (errorBody as { detail?: string }).detail
    const err: ApiError = {
      message: detail ?? errorBody.message ?? response.statusText,
      status: response.status,
      code: errorBody.code,
    }
    throw err
  }

  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string, params?: RequestOptions["params"]) =>
    request<T>("GET", path, undefined, { params }),
  post: <T>(path: string, body?: unknown) =>
    request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) =>
    request<T>("PATCH", path, body),
  put: <T>(path: string, body?: unknown) =>
    request<T>("PUT", path, body),
  delete: <T = void>(path: string, params?: RequestOptions["params"]) =>
    request<T>("DELETE", path, undefined, { params }),
}
