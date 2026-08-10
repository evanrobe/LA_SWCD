import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiGet } from '../../src/api/client'
import { queryClient } from '../../src/api/queryClient'

function TestWidget() {
  const { data, isPending } = useQuery({
    queryKey: ['test-widget'],
    queryFn: () => apiGet<{ message: string }>('/api/test'),
  })

  if (isPending) {
    return <p>Loading...</p>
  }

  return <p>{data?.message}</p>
}

describe('queryClient', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'hello from api' }),
      }),
    )
  })

  afterEach(() => {
    queryClient.clear()
    vi.unstubAllGlobals()
  })

  it('fetches through apiGet and renders the result', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TestWidget />
      </QueryClientProvider>,
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(await screen.findByText('hello from api')).toBeInTheDocument()
  })
})
