import type { ApiError } from "@/lib/types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

type RequestOptions = {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
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

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
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
