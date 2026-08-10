import { useServiceAction } from './useServiceAction'
import { searchCharacters } from '../services/characterService'
import type { Character } from '../api/types'

export function useSearchCharacters(name?: string) {
  return useServiceAction<Character[]>((signal) => searchCharacters(name, signal), [name])
}
