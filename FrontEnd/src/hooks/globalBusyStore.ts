type Listener = () => void

let busyCount = 0
const listeners = new Set<Listener>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

export function incrementBusyCount(): void {
  busyCount += 1
  emit()
}

export function decrementBusyCount(): void {
  busyCount = Math.max(0, busyCount - 1)
  emit()
}

export function subscribeToBusyCount(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getBusyCountSnapshot(): number {
  return busyCount
}

export function resetBusyCountForTests(): void {
  busyCount = 0
  emit()
}
