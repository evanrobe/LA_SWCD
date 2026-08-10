import { useServiceAction } from './useServiceAction'
import { getCharacterDetail } from '../services/characterService'
import type { CharacterDetail } from '../api/types'

export function useCharacterDetail(id: string | null) {
  return useServiceAction<CharacterDetail | null>(
    (signal) => (id ? getCharacterDetail(id, signal) : Promise.resolve(null)),
    [id],
  )
}
