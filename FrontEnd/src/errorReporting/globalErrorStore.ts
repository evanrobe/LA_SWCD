type Listener = () => void

let hasError = false
const listeners = new Set<Listener>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

export function reportGlobalError(error: unknown, context: string): void {
  console.error(`${context}:`, error)
  hasError = true
  emit()
}

export function clearGlobalError(): void {
  hasError = false
  emit()
}

export function subscribeToGlobalError(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getGlobalErrorSnapshot(): boolean {
  return hasError
}
