import { describe, expect, it, vi } from 'vitest'
import * as characterApi from '../../src/api/characterApi'
import { searchCharacters, getCharacterDetail } from '../../src/services/characterService'

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

describe('characterService.getCharacterDetail', () => {
  it('delegates to the character API with the same arguments and returns its result', async () => {
    const detail = {
      id: '1',
      name: 'Luke Skywalker',
      attributes: {
        birthYear: null,
        gender: null,
        height: null,
        mass: null,
        hairColor: null,
        eyeColor: null,
        skinColor: null,
      },
      species: null,
      homeworld: null,
    }
    const apiSpy = vi.spyOn(characterApi, 'getCharacterDetail').mockResolvedValue(detail)
    const controller = new AbortController()

    const result = await getCharacterDetail('1', controller.signal)

    expect(apiSpy).toHaveBeenCalledWith('1', controller.signal)
    expect(result).toBe(detail)

    apiSpy.mockRestore()
  })
})
