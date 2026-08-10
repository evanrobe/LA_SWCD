import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiGet } from '../../src/api/client'
import { queryClient } from '../../src/api/queryClient'
import { clearGlobalError, getGlobalErrorSnapshot } from '../../src/errorReporting/globalErrorStore'

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
  afterEach(() => {
    queryClient.clear()
    clearGlobalError()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetches through apiGet and renders the result', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'hello from api' }),
      }),
    )

    render(
      <QueryClientProvider client={queryClient}>
        <TestWidget />
      </QueryClientProvider>,
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(await screen.findByText('hello from api')).toBeInTheDocument()
  })

  it('retries a failing request once before giving up', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ message: 'recovered' }) })
    vi.stubGlobal('fetch', fetchMock)

    render(
      <QueryClientProvider client={queryClient}>
        <TestWidget />
      </QueryClientProvider>,
    )

    expect(await screen.findByText('recovered', undefined, { timeout: 3000 })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('reports a global error exactly once after retries are exhausted', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) }))

    render(
      <QueryClientProvider client={queryClient}>
        <TestWidget />
      </QueryClientProvider>,
    )

    await waitFor(() => expect(getGlobalErrorSnapshot()).toBe(true), { timeout: 3000 })

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
  })
})
