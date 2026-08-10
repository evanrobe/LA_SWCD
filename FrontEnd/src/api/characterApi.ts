import { apiGet } from './client'
import type { Character } from './types'

export function searchCharacters(name?: string, signal?: AbortSignal): Promise<Character[]> {
  const query = name ? `?name=${encodeURIComponent(name)}` : ''
  return apiGet<Character[]>(`/api/v1/characters/search${query}`, signal)
}
