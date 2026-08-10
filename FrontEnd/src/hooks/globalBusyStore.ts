type Listener = () => void

let busyCount = 0
let elementFocusedBeforeBusy: HTMLElement | null = null
const listeners = new Set<Listener>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

export function incrementBusyCount(): void {
  // GlobalLoadingBoundary makes the whole app `inert` while busy, and the browser forcibly
  // blurs whatever's focused inside an element that becomes inert. Capture it here — before
  // React re-renders and actually applies `inert` — so it can be refocused once we're done.
  if (busyCount === 0 && document.activeElement instanceof HTMLElement && document.activeElement !== document.body) {
    elementFocusedBeforeBusy = document.activeElement
  }
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

// Returns (and clears) the element captured in incrementBusyCount, if any. Consumed by
// GlobalLoadingBoundary once the DOM has actually stopped being inert — calling .focus()
// any earlier would silently fail, since focusing an inert element is a no-op.
export function takeElementFocusedBeforeBusy(): HTMLElement | null {
  const element = elementFocusedBeforeBusy
  elementFocusedBeforeBusy = null
  return element
}

export function resetBusyCountForTests(): void {
  busyCount = 0
  elementFocusedBeforeBusy = null
  emit()
}
