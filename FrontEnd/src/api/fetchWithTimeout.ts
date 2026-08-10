export const DEFAULT_API_TIMEOUT_MS = 10_000

export async function fetchWithTimeout<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  outerSignal: AbortSignal,
  timeoutMs: number = DEFAULT_API_TIMEOUT_MS,
): Promise<T> {
  const timeoutController = new AbortController()
  const timeoutId = setTimeout(() => {
    timeoutController.abort(new DOMException('Request timed out', 'TimeoutError'))
  }, timeoutMs)

  const onOuterAbort = () => timeoutController.abort(outerSignal.reason)
  outerSignal.addEventListener('abort', onOuterAbort)

  try {
    return await fetcher(timeoutController.signal)
  } finally {
    clearTimeout(timeoutId)
    outerSignal.removeEventListener('abort', onOuterAbort)
  }
}

export function isTimeoutError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'TimeoutError'
}
