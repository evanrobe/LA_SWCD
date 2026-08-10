import { apiGet } from './client'
import type { Character, CharacterDetail } from './types'

export function searchCharacters(name?: string, signal?: AbortSignal): Promise<Character[]> {
  const query = name ? `?name=${encodeURIComponent(name)}` : ''
  return apiGet<Character[]>(`/api/v1/characters/search${query}`, signal)
}

export function getCharacterDetail(id: string, signal?: AbortSignal): Promise<CharacterDetail> {
  return apiGet<CharacterDetail>(`/api/v1/characters/${encodeURIComponent(id)}`, signal)
}
