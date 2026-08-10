import { afterEach, describe, expect, it, vi } from 'vitest'
import { searchCharacters } from '../../src/api/characterApi'

describe('characterApi.searchCharacters', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the search endpoint without a query string when no name is given', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchMock)

    await searchCharacters()

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/characters/search', expect.anything())
  })

  it('appends an encoded name query param when a search term is given', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchMock)

    await searchCharacters('luke skywalker')

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/characters/search?name=luke%20skywalker', expect.anything())
  })

  it('returns the parsed character list', async () => {
    const characters = [{ id: '1', name: 'Luke Skywalker' }]
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(characters) }),
    )

    const result = await searchCharacters('luke')

    expect(result).toEqual(characters)
  })

  it('passes the abort signal through to the underlying request', async () => {
    let capturedSignal: AbortSignal | undefined
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init?: RequestInit) => {
        capturedSignal = init?.signal ?? undefined
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
      }),
    )
    const controller = new AbortController()

    await searchCharacters('luke', controller.signal)

    expect(capturedSignal).toBe(controller.signal)
  })
})
