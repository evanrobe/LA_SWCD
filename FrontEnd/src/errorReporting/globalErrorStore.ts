// Module-level store (subscribable via useSyncExternalStore) tracking whether an unrecoverable
// app-wide error has occurred; drives ErrorDialog.
type Listener = () => void

let hasError = false
const listeners = new Set<Listener>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

/** Logs the error and flips the global error flag on, notifying subscribers. */
export function reportGlobalError(error: unknown, context: string): void {
  console.error(`${context}:`, error)
  hasError = true
  emit()
}

/** Flips the global error flag off, notifying subscribers. */
export function clearGlobalError(): void {
  hasError = false
  emit()
}

/** Registers a listener to be called whenever the global error flag changes; returns an unsubscribe function. */
export function subscribeToGlobalError(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Returns the current global error flag. */
export function getGlobalErrorSnapshot(): boolean {
  return hasError
}
