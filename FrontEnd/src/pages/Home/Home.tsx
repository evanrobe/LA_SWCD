import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useCharacters } from '../../hooks/useCharacters'
import DatapadHeader from './components/DatapadHeader'
import CharacterList from './components/CharacterList'
import CharacterDetail from './components/CharacterDetail'
import FilmsSection from './components/FilmsSection'
import CraftSection from './components/CraftSection'
import styles from './Home.module.css'

const SEARCH_DEBOUNCE_MS = 300

function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, SEARCH_DEBOUNCE_MS)
  const { data } = useCharacters(debouncedSearchTerm)
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)

  return (
    <main className={styles.page}>
      <DatapadHeader searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />

      <div className={styles.charactersRow}>
        <CharacterList characters={data ?? []} selectedId={selectedCharacterId} onSelect={setSelectedCharacterId} />
        <CharacterDetail />
      </div>

      <FilmsSection />

      <div className={styles.craftRow}>
        <CraftSection title="Starships" />
        <CraftSection title="Vehicles" />
      </div>
    </main>
  )
}

export default Home
