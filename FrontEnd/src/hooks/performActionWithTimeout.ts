// Generic timeout/cancellation wrapper for any async action; the core useServiceAction builds on.
export const DEFAULT_ACTION_TIMEOUT_MS = 10_000

/** Runs `action`, aborting it if it doesn't settle within `timeoutMs` or if `outerSignal` aborts first. */
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
