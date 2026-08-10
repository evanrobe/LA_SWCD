import type { ReactElement, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
}

export function createQueryWrapper() {
  const queryClient = createTestQueryClient()

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

export function renderWithQueryClient(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: createQueryWrapper(), ...options })
}
