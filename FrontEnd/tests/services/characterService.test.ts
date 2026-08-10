import { describe, expect, it, vi } from 'vitest'
import * as characterApi from '../../src/api/characterApi'
import { searchCharacters } from '../../src/services/characterService'

describe('characterService.searchCharacters', () => {
  it('delegates to the character API with the same arguments and returns its result', async () => {
    const characters = [{ id: '1', name: 'Luke Skywalker' }]
    const apiSpy = vi.spyOn(characterApi, 'searchCharacters').mockResolvedValue(characters)
    const controller = new AbortController()

    const result = await searchCharacters('luke', controller.signal)

    expect(apiSpy).toHaveBeenCalledWith('luke', controller.signal)
    expect(result).toBe(characters)

    apiSpy.mockRestore()
  })
})
