// Service layer for characters: the only thing hooks should call into for character data.
import { searchCharacters as apiSearchCharacters, getCharacterDetail as apiGetCharacterDetail } from '../api/characterApi'
import type { Character, CharacterDetail } from '../api/types'

/** Searches characters by name (delegates to the API layer). */
export function searchCharacters(name?: string, signal?: AbortSignal): Promise<Character[]> {
  return apiSearchCharacters(name, signal)
}

/** Gets a character's composed detail view by id (delegates to the API layer). */
export function getCharacterDetail(id: string, signal?: AbortSignal): Promise<CharacterDetail> {
  return apiGetCharacterDetail(id, signal)
}
