// Low-level fetch wrapper shared by every api/*Api.ts module.
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

/** Thrown by apiGet when the response is not ok; carries the HTTP status code. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Issues a GET request against the API and parses the JSON response, throwing ApiError on failure. */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { signal })

  if (!response.ok) {
    throw new ApiError(response.status, `GET ${path} failed with status ${response.status}`)
  }

  return (await response.json()) as T
}
