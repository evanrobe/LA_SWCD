// Thin wrappers around the character endpoints of the LASWCD Web API.
import { apiGet } from './client'
import type { Character, CharacterDetail } from './types'

/** Searches characters by name (or lists all characters if no name is given). */
export function searchCharacters(name?: string, signal?: AbortSignal): Promise<Character[]> {
  const query = name ? `?name=${encodeURIComponent(name)}` : ''
  return apiGet<Character[]>(`/api/v1/characters/search${query}`, signal)
}

/** Gets a single character's composed detail view by id. */
export function getCharacterDetail(id: string, signal?: AbortSignal): Promise<CharacterDetail> {
  return apiGet<CharacterDetail>(`/api/v1/characters/${encodeURIComponent(id)}`, signal)
}
