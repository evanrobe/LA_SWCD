import { useServiceAction } from './useServiceAction'
import { searchCharacters } from '../services/characterService'
import type { Character } from '../api/types'

export function useCharacters(name?: string) {
  return useServiceAction<Character[]>((signal) => searchCharacters(name, signal), [name])
}
