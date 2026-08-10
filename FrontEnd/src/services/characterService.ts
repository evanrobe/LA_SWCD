import { searchCharacters as apiSearchCharacters, getCharacterDetail as apiGetCharacterDetail } from '../api/characterApi'
import type { Character, CharacterDetail } from '../api/types'

export function searchCharacters(name?: string, signal?: AbortSignal): Promise<Character[]> {
  return apiSearchCharacters(name, signal)
}

export function getCharacterDetail(id: string, signal?: AbortSignal): Promise<CharacterDetail> {
  return apiGetCharacterDetail(id, signal)
}
