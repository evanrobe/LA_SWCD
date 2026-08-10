import { useSyncExternalStore } from 'react'
import { getGlobalErrorSnapshot, subscribeToGlobalError } from './globalErrorStore'

export function useGlobalError(): boolean {
  return useSyncExternalStore(subscribeToGlobalError, getGlobalErrorSnapshot)
}
