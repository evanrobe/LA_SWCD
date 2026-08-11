// Detects whether a caught error came from an AbortSignal.timeout() abort.

/** True if `error` is a DOMException raised by an AbortSignal timeout. */
export function isTimeoutError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'TimeoutError'
}
