import { useEffect, useRef, useState, type DependencyList } from 'react'
import { performActionWithTimeout, DEFAULT_ACTION_TIMEOUT_MS } from './performActionWithTimeout'
import { incrementBusyCount, decrementBusyCount } from './globalBusyStore'
import { reportGlobalError } from '../errorReporting/globalErrorStore'
import { isTimeoutError } from '../errorReporting/isTimeoutError'

export const DEFAULT_RETRY_COUNT = 1
export const DEFAULT_RETRY_DELAY_MS = 1000

interface UseServiceActionOptions {
  timeoutMs?: number
  retryCount?: number
  retryDelayMs?: number
}

interface UseServiceActionResult<T> {
  data: T | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useServiceAction<T>(
  action: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
  options?: UseServiceActionOptions,
): UseServiceActionResult<T> {
  const [state, setState] = useState<UseServiceActionResult<T>>({
    data: undefined,
    isLoading: true,
    isError: false,
    error: undefined,
  })

  // Deps decide *when* to re-run; the action itself is read from a ref so callers
  // don't also have to memoize the action function to avoid re-running every render.
  const actionRef = useRef(action)
  actionRef.current = action

  // eslint-disable-next-line react-hooks/exhaustive-deps -- `deps` is caller-supplied, not statically analyzable
  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    setState({ data: undefined, isLoading: true, isError: false, error: undefined })
    incrementBusyCount()

    const retryCount = options?.retryCount ?? DEFAULT_RETRY_COUNT
    const retryDelayMs = options?.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS
    const timeoutMs = options?.timeoutMs ?? DEFAULT_ACTION_TIMEOUT_MS

    async function run(): Promise<void> {
      for (let attempt = 0; ; attempt++) {
        try {
          const result = await performActionWithTimeout((signal) => actionRef.current(signal), controller.signal, timeoutMs)
          if (!cancelled) {
            setState({ data: result, isLoading: false, isError: false, error: undefined })
          }
          return
        } catch (error) {
          if (cancelled) {
            return
          }
          if (attempt >= retryCount) {
            setState({ data: undefined, isLoading: false, isError: true, error })
            reportGlobalError(error, isTimeoutError(error) ? 'Action timed out' : 'Action failed')
            return
          }
          await delay(retryDelayMs)
        }
      }
    }

    run().finally(() => {
      decrementBusyCount()
    })

    return () => {
      cancelled = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `deps` is intentionally caller-supplied, mirroring useEffect's own contract
  }, deps)

  return state
}
