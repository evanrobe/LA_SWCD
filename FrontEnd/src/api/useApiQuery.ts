import { useQuery } from '@tanstack/react-query'
import { apiGet } from './client'
import { fetchWithTimeout } from './fetchWithTimeout'

interface UseApiQueryOptions {
  timeoutMs?: number
}

export function useApiQuery<T>(queryKey: readonly unknown[], path: string, options?: UseApiQueryOptions) {
  return useQuery<T, unknown>({
    queryKey,
    queryFn: ({ signal }) => fetchWithTimeout((innerSignal) => apiGet<T>(path, innerSignal), signal, options?.timeoutMs),
  })
}
