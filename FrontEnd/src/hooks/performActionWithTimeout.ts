export const DEFAULT_ACTION_TIMEOUT_MS = 10_000

export async function performActionWithTimeout<T>(
  action: (signal: AbortSignal) => Promise<T>,
  outerSignal: AbortSignal,
  timeoutMs: number = DEFAULT_ACTION_TIMEOUT_MS,
): Promise<T> {
  const timeoutController = new AbortController()
  const timeoutId = setTimeout(() => {
    timeoutController.abort(new DOMException('Action timed out', 'TimeoutError'))
  }, timeoutMs)

  const onOuterAbort = () => timeoutController.abort(outerSignal.reason)
  outerSignal.addEventListener('abort', onOuterAbort)

  try {
    return await action(timeoutController.signal)
  } finally {
    clearTimeout(timeoutId)
    outerSignal.removeEventListener('abort', onOuterAbort)
  }
}
