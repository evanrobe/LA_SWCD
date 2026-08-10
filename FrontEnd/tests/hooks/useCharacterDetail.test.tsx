import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { resetBusyCountForTests } from '../../src/hooks/globalBusyStore'
import { useCharacterDetail } from '../../src/hooks/useCharacterDetail'
import { clearGlobalError } from '../../src/errorReporting/globalErrorStore'

describe('useCharacterDetail', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetBusyCountForTests()
    clearGlobalError()
  })

  it('fetches from the character-by-id endpoint and returns the result', async () => {
    const detail = { id: '1', name: 'Luke Skywalker', attributes: {}, species: null, homeworld: null }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(detail),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useCharacterDetail('1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isError).toBe(false)
    expect(result.current.data).toEqual(detail)
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/characters/1', expect.anything())
  })

  it('resolves to null without calling the API when no id is selected', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useCharacterDetail(null))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('re-fetches when the selected id changes', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: '1', name: 'Luke Skywalker', attributes: {}, species: null, homeworld: null }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result, rerender } = renderHook(({ id }: { id: string | null }) => useCharacterDetail(id), {
      initialProps: { id: '1' as string | null },
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/characters/1', expect.anything())

    rerender({ id: '2' })

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/v1/characters/2', expect.anything()))
  })
})
