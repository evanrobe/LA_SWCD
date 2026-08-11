// Domain hook: fetches a character's composed detail view for the currently selected character.
import { useServiceAction } from './useServiceAction'
import { getCharacterDetail } from '../services/characterService'
import type { CharacterDetail } from '../api/types'

/** Fetches the detail view for character `id`, or resolves to null without calling the API when `id` is null. */
export function useCharacterDetail(id: string | null) {
  return useServiceAction<CharacterDetail | null>(
    (signal) => (id ? getCharacterDetail(id, signal) : Promise.resolve(null)),
    [id],
  )
}
