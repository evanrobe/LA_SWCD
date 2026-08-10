import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useCharacters } from '../../../src/api/hooks/useCharacters'
import { createQueryWrapper } from '../../test-utils'

describe('useCharacters', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
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

    const { result } = renderHook(() => useCharacters(), { wrapper: createQueryWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(characters)
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/characters/search', expect.anything())
  })
})
