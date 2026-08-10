import { useSyncExternalStore } from 'react'
import { getBusyCountSnapshot, subscribeToBusyCount } from './globalBusyStore'

export function useIsBusy(): boolean {
  const count = useSyncExternalStore(subscribeToBusyCount, getBusyCountSnapshot)
  return count > 0
}
