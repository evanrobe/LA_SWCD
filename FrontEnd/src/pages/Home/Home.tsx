import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useSearchCharacters } from '../../hooks/useSearchCharacters'
import { useCharacterDetail } from '../../hooks/useCharacterDetail'
import DatapadHeader from './components/DatapadHeader'
import CharacterList from './components/CharacterList'
import CharacterDetail from './components/CharacterDetail'
import FilmsSection from './components/FilmsSection'
import StarshipsSection from './components/StarshipsSection'
import CraftSection from './components/CraftSection'
import styles from './Home.module.css'

const SEARCH_DEBOUNCE_MS = 300

function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, SEARCH_DEBOUNCE_MS)
  const { data } = useSearchCharacters(debouncedSearchTerm)
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)

  useEffect(() => {
    setSelectedCharacterId(data && data.length > 0 ? data[0].id : null)
  }, [data])

  const { data: selectedCharacter } = useCharacterDetail(selectedCharacterId)

  return (
    <main className={styles.page}>
      <DatapadHeader searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />

      <div className={styles.charactersRow}>
        <CharacterList characters={data ?? []} selectedId={selectedCharacterId} onSelect={setSelectedCharacterId} />
        <CharacterDetail character={selectedCharacter} />
      </div>

      <FilmsSection />

      <div className={styles.craftRow}>
        <StarshipsSection starships={selectedCharacter?.starships ?? []} />
        <CraftSection title="Vehicles" />
      </div>
    </main>
  )
}

export default Home
