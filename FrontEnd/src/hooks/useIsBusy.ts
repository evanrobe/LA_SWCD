// React hook for reading the global busy store.
import { useSyncExternalStore } from 'react'
import { getBusyCountSnapshot, subscribeToBusyCount } from './globalBusyStore'

/** True while one or more service actions are in flight anywhere in the app. */
export function useIsBusy(): boolean {
  const count = useSyncExternalStore(subscribeToBusyCount, getBusyCountSnapshot)
  return count > 0
}
