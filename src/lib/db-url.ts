/** Normalize Traza/FastAPI async URL to node-postgres URL for Better Auth. */
export function nodePostgresUrl(url: string | undefined): string {
  if (!url) {
    return "postgresql://postgres:postgres@localhost:5432/traza"
  }
  return url.replace(/^postgresql\+asyncpg:\/\//, "postgresql://")
}
