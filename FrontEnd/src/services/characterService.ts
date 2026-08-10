import { searchCharacters as apiSearchCharacters } from '../api/characterApi'
import type { Character } from '../api/types'

export function searchCharacters(name?: string, signal?: AbortSignal): Promise<Character[]> {
  return apiSearchCharacters(name, signal)
}
