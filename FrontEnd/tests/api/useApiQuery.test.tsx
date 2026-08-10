import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { isTimeoutError } from '../../src/api/fetchWithTimeout'
import { useApiQuery } from '../../src/api/useApiQuery'
import { createQueryWrapper } from '../test-utils'

describe('useApiQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the parsed JSON response on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'hello' }),
      }),
    )

    const { result } = renderHook(() => useApiQuery<{ message: string }>(['widget'], '/api/widget'), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual({ message: 'hello' })
  })

  it('surfaces a non-timeout error when the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      }),
    )

    const { result } = renderHook(() => useApiQuery(['widget'], '/api/widget'), { wrapper: createQueryWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(isTimeoutError(result.current.error)).toBe(false)
  })

  it('aborts the request and surfaces a TimeoutError when it exceeds the timeout', async () => {
    let capturedSignal: AbortSignal | undefined

    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init?: RequestInit) => {
        capturedSignal = init?.signal ?? undefined
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(init.signal!.reason))
        })
      }),
    )

    const { result } = renderHook(() => useApiQuery(['widget'], '/api/widget', { timeoutMs: 20 }), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(isTimeoutError(result.current.error)).toBe(true)
    expect(capturedSignal?.aborted).toBe(true)
  })
})
