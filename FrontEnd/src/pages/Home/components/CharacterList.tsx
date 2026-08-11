// Scrollable list of search results; clicking a character selects it.
import type { Character } from '../../../api/types'
import styles from './CharacterList.module.css'

interface CharacterListProps {
  characters: Character[]
  selectedId: string | null
  onSelect: (id: string) => void
}

/** Renders characters as selectable buttons, highlighting the currently selected one. */
function CharacterList({ characters, selectedId, onSelect }: CharacterListProps) {
  return (
    <section className={styles.container}>
      <h2 className={styles.label}>Characters</h2>
      <ul className={styles.list} aria-label="Character list">
        {characters.map((character) => (
          <li key={character.id}>
            <button
              type="button"
              className={character.id === selectedId ? styles.itemSelected : styles.item}
              aria-pressed={character.id === selectedId}
              onClick={() => onSelect(character.id)}
            >
              {character.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CharacterList
