// Domain hook: fetches the character list shown in CharacterList, filtered by the search box.
import { useServiceAction } from './useServiceAction'
import { searchCharacters } from '../services/characterService'
import type { Character } from '../api/types'

/** Searches characters by name, re-fetching whenever `name` changes. */
export function useSearchCharacters(name?: string) {
  return useServiceAction<Character[]>((signal) => searchCharacters(name, signal), [name])
}
