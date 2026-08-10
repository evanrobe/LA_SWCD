import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { reportGlobalError } from '../errorReporting/globalErrorStore'
import { isTimeoutError } from './fetchWithTimeout'

export const DEFAULT_QUERY_RETRY_COUNT = 1
export const DEFAULT_QUERY_RETRY_DELAY_MS = 1000

function handleApiError(error: unknown): void {
  reportGlobalError(error, isTimeoutError(error) ? 'API request timed out' : 'API request failed')
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleApiError,
  }),
  mutationCache: new MutationCache({
    onError: handleApiError,
  }),
  defaultOptions: {
    queries: {
      retry: DEFAULT_QUERY_RETRY_COUNT,
      retryDelay: DEFAULT_QUERY_RETRY_DELAY_MS,
      refetchOnWindowFocus: false,
    },
  },
})
