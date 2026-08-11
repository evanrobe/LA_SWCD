// React hook for reading the global error store.
import { useSyncExternalStore } from 'react'
import { getGlobalErrorSnapshot, subscribeToGlobalError } from './globalErrorStore'

/** Subscribes to and returns the current global error flag. */
export function useGlobalError(): boolean {
  return useSyncExternalStore(subscribeToGlobalError, getGlobalErrorSnapshot)
}
