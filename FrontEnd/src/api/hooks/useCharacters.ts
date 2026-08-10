import { useApiQuery } from '../useApiQuery'
import type { Character } from '../types'

export function useCharacters() {
  return useApiQuery<Character[]>(['characters'], '/api/v1/characters/search')
}
