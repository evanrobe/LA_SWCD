import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { resetBusyCountForTests } from '../../src/hooks/globalBusyStore'
import { useCharacters } from '../../src/hooks/useCharacters'
import { clearGlobalError } from '../../src/errorReporting/globalErrorStore'

describe('useCharacters', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetBusyCountForTests()
    clearGlobalError()
  })

  it('fetches from the characters search endpoint and returns the results', async () => {
    const characters = [
      { id: '1', name: 'Luke Skywalker' },
      { id: '2', name: 'Leia Organa' },
    ]
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(characters),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useCharacters())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isError).toBe(false)
    expect(result.current.data).toEqual(characters)
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/characters/search', expect.anything())
  })

  it('re-fetches when the search name changes', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: '1', name: 'Luke Skywalker' }]),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result, rerender } = renderHook(({ name }: { name?: string }) => useCharacters(name), {
      initialProps: { name: undefined as string | undefined },
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/characters/search', expect.anything())

    rerender({ name: 'luke' })

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/v1/characters/search?name=luke', expect.anything()))
  })
})
